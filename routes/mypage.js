const express = require("express");
const router = express.Router();
const Product = require("../models/game");

const tiers = ["amateur", "pro", "elite", "beginner"];
const sports = ["baseball", "basketball", "soccer", "futsal"];

router.get("/", async (req, res) => {
  const products = await Product.find();
  if (!req.isAuthenticated()) {
    req.flash("error", "로그인하세요");
    return res.redirect("/login");
  }
  res.render("mypage/mypage", { products });
});

router.get("/new", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "로그인하세요");
    return res.redirect("/login");
  }
  res.render("mypage/new", { tiers });
});

router.post("/new", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  req.flash("success", "등록되었습니다!");
  res.redirect("/mypage");
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!req.isAuthenticated()) {
    req.flash("error", "접근권한이 없습니다");
    return res.redirect("/login");
  }
  res.render("mypage/show", { product, tiers, sports });
});

router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("mypage/edit", { product, tiers, sports });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
  });
  res.redirect(`/mypage/${product._id}`);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  req.flash("error", "삭제되었습니다!");
  res.redirect("/mypage");
});

module.exports = router;
