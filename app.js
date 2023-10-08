const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Resort = require('./models/resort');

mongoose.connect('mongodb://localhost:27017/swiss-resorts');

const app = express();

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/resorts', async (req, res) => {
    const resorts = await Resort.find({});
    res.render('resorts/index', {resorts})
})

app.get('/resorts/new', (req, res) => {
    res.render('resorts/new');
})

app.post('/resorts', async (req, res) => {
    const resort = new Resort(req.body.resort);
    await resort.save();
    res.redirect(`/resorts/${resort._id}`);
})


app.get('/resorts/:id', async (req, res) => {
    const resort = await Resort.findById(req.params.id)
    res.render('resorts/show', { resort })
})

app.get('/resorts/:id/edit', async (req, res) => {
    const resort = await Resort.findById(req.params.id)
    res.render('resorts/edit', { resort })
})

app.put('/resorts/:id', async (req, res) => {
    const { id } = req.params;
    const resort = await Resort.findByIdAndUpdate(id, { ...req.body.resort });
    res.redirect(`/resorts/${resort._id}`)
});

app.delete('/resorts/:id', async (req, res) => {
    const { id } = req.params;
    await Resort.findByIdAndDelete(id);
    res.redirect('/resorts');
})


app.listen(3000, () => {
    console.log('Serving on port 3000')
})