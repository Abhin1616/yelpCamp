const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync")
const campground = require("../contollers/campground")
const multer = require('multer')
const { storage } = require("../cloudinary/index")
const upload = multer({ storage })
const { isLoggedIn, validateCampground, isAuthor } = require("../utils/middleware.js")

router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(campground.editShowPage))

router.get("/new", isLoggedIn, campground.newShowPage)

router.route("/")
    .get(wrapAsync(campground.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, wrapAsync(campground.createNewCG))
// .post(validateCampground, upload.array('image'), (req, res) => {
//     console.log(req.files)
//     res.send("it worked")
// })

router.route("/:id")
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, wrapAsync(campground.editCG))
    .delete(isLoggedIn, isAuthor, wrapAsync(campground.deleteCG))
    .get(wrapAsync(campground.checkCG))


module.exports = router