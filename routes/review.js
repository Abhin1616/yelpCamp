const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync")
const review = require("../contollers/review")
const Campground = require("../models/campground")
const { validateReview, isLoggedIn, isReviewAuthor } = require("../utils/middleware")


router.post("/", isLoggedIn, validateReview, wrapAsync(review.createNewRev))
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(review.deleteRev))

module.exports = router;