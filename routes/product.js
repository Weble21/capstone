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
    const { id } = req.params;
    const { username, phone_num, fair_tier } = req.body; // 폼에서 제출된 데이터를 받아옵니다.
    const game = await Product.findById(id);

    if (!game) {
      req.flash("error", "해당 경기를 찾을 수 없습니다!");
      return res.status(404).redirect("/");
    }

    const existingApplicant = game.submittedNum.find(
      (applicant) =>
        applicant.username === username &&
        applicant.phone_num === phone_num &&
        applicant.fair_tier === fair_tier
    );

    if (!existingApplicant) {
      req.flash("error", "유효하지 않은 신청자입니다!");
      return res.status(400).redirect("/");
    }

    const user = await User.findOne({ username: existingApplicant.username });
    if (!user) {
      req.flash("error", "유효하지 않은 신청자입니다!");
      return res.status(400).redirect("/");
    } else {
      existingApplicant.fair_tier += 1;
      await user.save();
    }

    req.flash("success", "추천이 완료되었습니다!");
    res.status(200).redirect("/mypage");
  } catch (error) {
    console.error(error);
    req.flash("error", "오류가 발생했습니다!");
    res.status(500).redirect("/404");
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
      (user) =>
        user.username === username &&
        user.phone_num === phone_num &&
        user.fair_tier === fair_tier
    );

    if (submittedUser) {
      req.flash("error", "이미 신청한 사용자입니다!");
      return res.status(400).redirect("/");
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
