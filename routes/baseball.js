const express = require("express");
const router = express.Router();
const Product = require("../models/game");

router.get("/", async (req, res) => {
  const { tier } = req.query;
  const products = await Product.find({ sport: "baseball" });
  switch (tier) {
    case "beginner":
      res.render("baseball/beginner", { tier, products });
      break;
    case "amateur":
      res.render("baseball/amateur", { tier, products });
      break;
    case "elite":
      res.render("baseball/elite", { tier, products });
      break;
    case "pro":
      res.render("baseball/pro", { tier, products });
      break;
    default:
      res.render("baseball/amateur", { tier, products });
      break;
  }
});

module.exports = router;
