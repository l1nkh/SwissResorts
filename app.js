const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { resortSchema } = require('./schemas.js');
const catchAsync = require('./models/utils/catchAsync');
const ExpressError = require('./models/utils/ExpressError');
const methodOverride = require('method-override');
const Resort = require('./models/resort');

mongoose.connect('mongodb://localhost:27017/swiss-resorts');

const app = express();

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

const validateResort = (req, res, next) => {
    const { error } = resortSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
});
app.get('/resorts', catchAsync(async (req, res) => {
    const resorts = await Resort.find({});
    res.render('resorts/index', { resorts })
}));

app.get('/resorts/new', (req, res) => {
    res.render('resorts/new');
})


app.post('/resorts', validateResort, catchAsync(async (req, res, next) => {
    // if (!req.body.resort) throw new ExpressError('Invalid resort Data', 400);
    const resort = new Resort(req.body.resort);
    await resort.save();
    res.redirect(`/resorts/${resort._id}`)
}))

app.get('/resorts/:id', catchAsync(async (req, res,) => {
    const resort = await Resort.findById(req.params.id)
    res.render('resorts/show', { resort });
}));

app.get('/resorts/:id/edit', catchAsync(async (req, res) => {
    const resort = await Resort.findById(req.params.id)
    res.render('resorts/edit', { resort });
}))

app.put('/resorts/:id', validateResort, catchAsync(async (req, res) => {
    const { id } = req.params;
    const resort = await Resort.findByIdAndUpdate(id, { ...req.body.resort });
    res.redirect(`/resorts/${resort._id}`)
}));

app.delete('/resorts/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Resort.findByIdAndDelete(id);
    res.redirect('/resorts');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})