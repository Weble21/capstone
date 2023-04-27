const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const port = 3000;

const Product = require('./models/game');

mongoose.connect('mongodb://localhost:27017/games')
.then(()=> {
    console.log('MONGO CONNECTION OPEN!!!');
})
.catch(err => {
    console.log('Oh No,,, Error!!!');
    console.log(err);
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))


app.use(express.static(path.join(__dirname, "public")))

//test
const categories = ['fruit', 'vegetable', 'dairy'];
app.get('/products', async (req, res) => {
    const {category} =  req.query;
    if(category) {
        const products = await Product.find({category})
        res.render('products/index', { products, category })
    } else {
        const products = await Product.find({})
        res.render('products/index', { products, category: 'All' })
    }
    
})
app.get('/products/new', (req, res) => {
    res.render('products/new', {categories})
})
app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`)
})
app.get('/products/:id', async (req, res) => {
    const { id } =req.params;
    const product = await Product.findById(id)
    res.render('products/show', { product })
})//순서 중요
app.get('/products/:id/edit', async (req, res) => {
    const { id } =req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories })
})
app.put('/products/:id', async(req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true });
    res.redirect(`/products/${product._id}`)
})
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})


app.get('/', async (req, res) => {
    const products = await Product.find({})
    var now = new Date();
    var currentMonth = now.getMonth() + 1;
    var currentDate = now.getDate(); // 월은 0부터 시작하므로 1을 더해줍니다.
    var currentTime = { month: currentMonth, date: currentDate };
    res.render('main', { products, currentTime })
})

const tiers = ['amateur', 'pro', 'elite', 'beginner'];
app.get('/soccer', async (req, res) => {
    const { tier } = req.query;
    const products = await Product.find({sport: 'soccer'});
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
})
app.get('/soccer/new', (req, res) => {
    res.render('soccer/new', {tiers})
})
app.post('/soccer', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect('/soccer')
})
app.get('/soccer/:id', async (req, res) => {
    const { id } =req.params;
    const product = await Product.findById(id)
    res.render('soccer/amateur', { product })
})

app.get('/baseball', async (req, res) => {
    const { tier } = req.query;
    const products = await Product.find({sport: 'baseball'});
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
})

app.get('/basketball', async (req, res) => {
    const { tier } = req.query;
    const products = await Product.find({sport: 'basketball'});
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
})

app.get('/futsal', async (req, res) => {
    const { tier } = req.query;
    const products = await Product.find({sport: 'futsal'});
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
})




app.listen(port, () => {
    console.log(`Listening on Port ${port}`)
})

