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

app.get('/baseball', (req, res) => {
    res.render('baseball')
})

app.get('/basketball', (req, res) => {
    res.render('basketball')
})

app.get('/futsal', (req, res) => {
    res.render('futsal')
})

app.get('/soccer', (req, res) => {
    res.render('soccer')
})

app.listen(port, () => {
    console.log(`Listening on Port ${port}`)
}) 