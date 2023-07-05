const express = require("express");
const router = express.Router();
const Product = require("../models/game");

router.get("/", async (req, res) => {
  const { tier } = req.query;
  const products = await Product.find({ sport: "futsal" });
  switch (tier) {
    case "beginner":
      res.render("futsal/beginner", { tier, products });
      break;
    case "amateur":
      res.render("futsal/amateur", { tier, products });
      break;
    case "elite":
      res.render("futsal/elite", { tier, products });
      break;
    case "pro":
      res.render("futsal/pro", { tier, products });
      break;
    default:
      res.render("futsal/amateur", { tier, products });
      break;
  }
});

module.exports = router;
