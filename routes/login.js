const express = require("express");
const passport = require("passport");
const router = express.Router();

const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", async (req, res) => {
  try {
    const { email, username, password, phone_num } = req.body;
    const user = new User({ email, username, phone_num });
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.flash(
      "success",
      `${registeredUser.username}님, Fair Play에 오신걸 환영합니다!`
    );
    res.redirect("/");
  } catch (e) {
    req.flash("error", "이미 등록된 사용자입니다");
    res.redirect("/register");
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.login(req.user, function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "로그인되었습니다.");
      return res.redirect("/");
    });
  }
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    req.flash("success", "GoodBye!!");
    res.redirect("/");
  });
});

module.exports = router;
