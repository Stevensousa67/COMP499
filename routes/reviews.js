const express = require('express');
const path = require('path');
const Campground = require('../models/campground');
const Review = require('../models/review');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { validateReview } = require('../utils/JOI-Validations.js');
const router = express.Router({ mergeParams: true });

router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/`);
}));

module.exports = router;