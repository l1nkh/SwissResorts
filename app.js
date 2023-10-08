const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
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

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/resorts', async (req, res) => {
    const resorts = await Resort.find({});
    res.render('resorts/index', {resorts})
})

app.get('/resorts/:id', async (req, res) => {
    const resort = await Resort.findById(req.params.id)
    res.render('resorts/show', { resort })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})