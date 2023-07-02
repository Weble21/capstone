const express = require("express");
const router = express.Router();
const Product = require("../models/game");

const tiers = ["amateur", "pro", "elite", "beginner"];
const sports = ["baseball", "basketball", "soccer", "futsal"];

router.get("/", async (req, res) => {
  const { tier } = req.query;
  const products = await Product.find({ sport: "basketball" });
  switch (tier) {
    case "beginner":
      res.render("basketball/beginner", { tier, products });
      break;
    case "amateur":
      res.render("basketball/amateur", { tier, products });
      break;
    case "elite":
      res.render("basketball/elite", { tier, products });
      break;
    case "pro":
      res.render("basketball/pro", { tier, products });
      break;
    default:
      res.render("basketball/amateur", { tier, products });
      break;
  }
});

module.exports = router;
