const express = require("express");
const router = express.Router();
const Product = require("../models/game");

router.get("/", async (req, res) => {
  const { tier } = req.query;
  const products = await Product.find({ sport: "soccer" });
  switch (tier) {
    case "beginner":
      res.render("soccer/beginner", { tier, products });
      break;
    case "amateur":
      res.render("soccer/amateur", { tier, products });
      break;
    case "elite":
      res.render("soccer/elite", { tier, products });
      break;
    case "pro":
      res.render("soccer/pro", { tier, products });
      break;
    default:
      res.render("soccer/amateur", { tier, products });
      break;
  }
});

module.exports = router;
