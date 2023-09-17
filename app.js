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
const cron = require("node-cron");

const soccerRoutes = require("./routes/soccer");
const basketballRoutes = require("./routes/basketball");
const futsalRoutes = require("./routes/futsal");
const baseballRoutes = require("./routes/baseball");
const mypageRoutes = require("./routes/mypage");
const loginRoutes = require("./routes/login");
const productRoutes = require("./routes/product");

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

app.get("/", async (req, res) => {
  const products = await Product.find({});
  const users = await User.find({});
  var now = new Date();
  var currentMonth = now.getMonth() + 1;
  var currentDate = now.getDate(); // 월은 0부터 시작하므로 1을 더해줍니다.
  var currentTime = { month: currentMonth, date: currentDate };
  res.render("main", { products, currentTime, users });
});

app.use("/soccer", soccerRoutes);
app.use("/basketball", basketballRoutes);
app.use("/baseball", baseballRoutes);
app.use("/futsal", futsalRoutes);

app.use("/mypage", mypageRoutes);

app.use("/", loginRoutes);
app.use("/products", productRoutes);

const currentDate = new Date();
const minutes = currentDate.getMinutes();
const hours = currentDate.getHours();

const cronExpression = `${minutes + 1} ${hours} * * *`;
// 매일 서버를 틀어놀 수 없으니 서버 실행 후 1분 뒤 3일 전의 경기들 삭제
const task = cron.schedule(cronExpression, async () => {
  const deletionDate = new Date(currentDate);
  deletionDate.setDate(deletionDate.getDate() - 2);

  try {
    // deletionDate 이전의 경기들을 삭제
    await Product.deleteMany({ time: { $lt: deletionDate } });

    console.log("3일 이전 상품 삭제 완료");
  } catch (error) {
    console.error("상품 삭제 중 오류 발생:", error);
  }
});
// 스케줄러 실행
task.start();

app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(port, () => {
  console.log(`Listening on Port ${port}`);
});

//오류로 인한 덮어쓰기 -v2
