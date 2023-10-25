const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { resortSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');
const { isAuthor } = require('../middleware');
const { validateResort } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const Resort = require('../models/resort');

router.get('/', catchAsync(async (req, res) => {
    const resorts = await Resort.find({});
    res.render('resorts/index', { resorts })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('resorts/new');
})


router.post('/', isLoggedIn, validateResort, catchAsync(async (req, res, next) => {
    const resort = new Resort(req.body.resort);
    resort.author = req.user._id;
    await resort.save();
    req.flash('success', 'Successfully made a new resort!');
    res.redirect(`/resorts/${resort._id}`)
}))

router.get('/:id', catchAsync(async (req, res,) => {
    const resort = await Resort.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!resort) {
        req.flash('error', 'Cannot find that resort!');
        return res.redirect('/resorts');
    }
    res.render('resorts/show', { resort });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const resort = await Resort.findById(id);
    if (!resort) {
        req.flash('error', 'Cannot find that resort!');
        return res.redirect('/resorts');
    }
    res.render('resorts/edit', { resort });
}))

router.put('/:id', isLoggedIn, isAuthor, validateResort, catchAsync(async (req, res) => {
    const { id } = req.params;
    const resort = await Resort.findByIdAndUpdate(id, { ...req.body.resort });
    req.flash('success', 'Successfully updated resort!');
    res.redirect(`/resorts/${resort._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor,catchAsync(async (req, res) => {
    const { id } = req.params;
    await Resort.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted resort')
    res.redirect('/resorts');
}));

module.exports = router;