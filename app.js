const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const port = 3000;
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user");
const Product = require("./models/game");

mongoose
  .connect("mongodb://localhost:27017/games")
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("Oh No,,, Error!!!");
    console.log(err);
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 21,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, "public")));

app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", async (req, res) => {
  const { email, username, password, phone_num } = req.body;
  const user = new User({ email, username, phone_num });
  const registeredUser = await User.register(user, password);
  req.flash("success", "Fair Play에 오신걸 환영합니다!");
  res.redirect("/");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post(
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
app.get("/logout", (req, res) => {
  req.logout(() => {
    req.flash("success", "GoodBye!!");
    res.redirect("/");
  });
});

app.get("/", async (req, res) => {
  const products = await Product.find({});
  var now = new Date();
  var currentMonth = now.getMonth() + 1;
  var currentDate = now.getDate(); // 월은 0부터 시작하므로 1을 더해줍니다.
  var currentTime = { month: currentMonth, date: currentDate };
  res.render("main", { products, currentTime });
});

const tiers = ["amateur", "pro", "elite", "beginner"];
const sports = ["baseball", "basketball", "soccer", "futsal"];

app.get("/soccer", async (req, res) => {
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

app.get("/soccer/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("soccer/amateur", { product });
});

app.get("/baseball", async (req, res) => {
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

app.get("/basketball", async (req, res) => {
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

app.get("/futsal", async (req, res) => {
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

app.get("/mypage", async (req, res) => {
  const products = await Product.find();
  if (!req.isAuthenticated()) {
    req.flash("error", "로그인하세요");
    return res.redirect("/login");
  }
  res.render("mypage/mypage", { products });
});

app.get("/mypage/new", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "로그인하세요");
    return res.redirect("/login");
  }
  res.render("mypage/new", { tiers });
});
app.post("/mypage/new", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  req.flash("success", "등록되었습니다!");
  res.redirect("/mypage");
});

app.get("/mypage/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("mypage/show", { product, tiers, sports });
});
app.get("/mypage/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("mypage/edit", { product, tiers, sports });
});
app.put("/mypage/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
  });
  res.redirect(`/mypage/${product._id}`);
});

app.delete("/mypage/:id", async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  req.flash("error", "삭제되었습니다!");
  res.redirect("/mypage");
});

app.listen(port, () => {
  console.log(`Listening on Port ${port}`);
});
