const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");

const port = 3000;

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {
    res.render('main')
})

app.listen(port, () => {
    console.log(`Listening on Port ${port}`)
}) 