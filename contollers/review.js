const Review = require("../models/review");
const Campground = require("../models/campground")

module.exports.createNewRev = async (req, res) => {
    const { id } = req.params;
    const { body, rating } = req.body;
    const author = req.user;
    const review = new Review({ body, rating, author })
    const campground = await Campground.findById(id);
    campground.reviews.push(review);
    await review.save();
    await campground.save()
    req.flash("success", "Successfully created a new review!")
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteRev = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "Review has been deleted!")
    res.redirect(`/campgrounds/${id}`)
}