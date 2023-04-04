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
    const { tier } = req.query;
    switch (tier) {
        case "beginner":
            res.render("baseball/beginner", { tier });
            break;
        case "amateur":
            res.render("baseball/amateur", { tier });
            break;
        case "elite":
            res.render("baseball/elite", { tier });
            break;
        case "pro":
            res.render("baseball/pro", { tier });
            break;
        default:
            res.render("baseball/amateur", { tier });
            break;
    }
})

app.get('/basketball', (req, res) => {
    const { tier } = req.query;
    switch (tier) {
        case "beginner":
            res.render("basketball/beginner", { tier });
            break;
        case "amateur":
            res.render("basketball/amateur", { tier });
            break;
        case "elite":
            res.render("basketball/elite", { tier });
            break;
        case "pro":
            res.render("basketball/pro", { tier });
            break;
        default:
            res.render("basketball/amateur", { tier });
            break;
    }
})

app.get('/futsal', (req, res) => {
    const { tier } = req.query;
    switch (tier) {
        case "beginner":
            res.render("futsal/beginner", { tier });
            break;
        case "amateur":
            res.render("futsal/amateur", { tier });
            break;
        case "elite":
            res.render("futsal/elite", { tier });
            break;
        case "pro":
            res.render("futsal/pro", { tier });
            break;
        default:
            res.render("futsal/amateur", { tier });
            break;
    }
})

app.get('/soccer', (req, res) => {
    const { tier } = req.query;
    switch (tier) {
        case "beginner":
            res.render("soccer/beginner", { tier });
            break;
        case "amateur":
            res.render("soccer/amateur", { tier });
            break;
        case "elite":
            res.render("soccer/elite", { tier });
            break;
        case "pro":
            res.render("soccer/pro", { tier });
            break;
        default:
            res.render("soccer/amateur", { tier });
            break;
    }
})


app.listen(port, () => {
    console.log(`Listening on Port ${port}`)
}) 