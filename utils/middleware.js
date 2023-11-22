const Campground = require("../models/campground")
const Review = require("../models/review")
const ExpressError = require("../utils/ExpressError.js")
const { campgroundSchema, reviewSchema } = require("../schemas")

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((e) => (e.message)).join(", ")
        throw new ExpressError(404, msg);
    } else {
        next()
    }
}
const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "Permission Denied!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Please log in first!")
        return res.redirect("/login")
    }
    next();
}
const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((e) => (e.message)).join(", ")
        throw new ExpressError(404, msg);
    } else {
        next()
    }
}
const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "Permission Denied!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}
module.exports = { isLoggedIn, storeReturnTo, validateCampground, isAuthor, validateReview, isReviewAuthor };