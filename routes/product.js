const express = require("express");
const passport = require("passport");
const router = express.Router();

const Product = require("../models/game");
const User = require("../models/user");

router.post("/:id/application", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { application: true },
      { new: true }
    );

    if (updatedProduct) {
      req.flash("success", "경기가 마감되었습니다!");
      res.redirect("/mypage");
    } else {
      req.flash("error", "해당 제품을 찾을 수 없습니다.");
      res.redirect("/mypage");
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "application 업데이트 중 오류가 발생했습니다.");
    res.redirect("/mypage");
  }
});

router.post("/:id/recommend", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      console.log("errr");
      req.flash("error", "로그인하세요");
      return res.redirect("/login");
    }

    const { id } = req.params; // 폼에서 제출된 게임의 id.
    const game = await Product.findById(id);
    const { username: current_username, phone_num: current_phone_num } =
      req.user;
    const idx = parseInt(req.body.idx);

    if (game === null) {
      req.flash("error", "해당 경기를 찾을 수 없습니다!");
      return res.status(404).redirect("/");
    }

    //game.submittedNum는 배열이기에 [idx]으로 배열에 접근
    if (
      current_username === game.submittedNum[idx].username &&
      current_phone_num === game.submittedNum[idx].phone_num
    ) {
      req.flash("error", "자기자신은 추천할 수 없습니다");
      return res.status(400).redirect("/mypage");
    } else {
      //추천받은 유저의 fair_tier +1;
      const nameToFind = game.submittedNum[idx].name;
      const phoneNumToFind = game.submittedNum[idx].phone_num;
      try {
        const userToUp = await User.findOne({
          name: nameToFind,
          phone_num: phoneNumToFind,
        });
        if (!userToUp) {
          req.flash("error", "추천한 사용자가 존재하지 않습니다");
          return res.status(404).redirect("/404");
        }
        userToUp.fair_tier += 1;
        await userToUp.save();
        req.flash("success", "test");
        console.log(userToUp.fair_tier);
      } catch (err) {
        console.log("Update error!", err);
        req.flash("error", "업데이트 중 오류가 발생하였습니다.");
      }
    }

    res.status(200).redirect("/mypage");
  } catch (error) {
    console.error(error);
    req.flash("error", "오류가 발생했습니다!");
    res.status(500).redirect("/");
  }
});

router.post("/:id/apply", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, phone_num, fair_tier } = req.user;

    const game = await Product.findById(id);

    if (!game) {
      req.flash("error", "해당 경기를 찾을 수 없습니다!");
      return res.status(404).redirect("/");
    }

    const submittedUser = game.submittedNum.find(
      (user) => user.username === username && user.phone_num === phone_num
    );

    if (submittedUser) {
      req.flash("error", "이미 신청한 사용자입니다!");
      return res.status(400).redirect("/mypage");
    }

    game.submittedNum.push({ username, phone_num, fair_tier });
    await game.save();
    req.flash("success", "신청이 완료되었습니다!");
    res.status(200).redirect("/mypage");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error 발생!");
    res.status(500).redirect("/");
  }
});

module.exports = router;
