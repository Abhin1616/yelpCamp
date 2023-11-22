const Campground = require("../models/campground")
const { cloudinary } = require("../cloudinary/index")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

module.exports.index = async (req, res) => {

    const allCampgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { allCampgrounds })
}

module.exports.createNewCG = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    const { title, price, description, location } = req.body;
    const geometry = geoData.body.features[0].geometry

    // if (!title || !price || !location || !image || !description) {
    //     throw new ExpressError(400, "Invalid Campground Data!")
    // }
    const author = req.user;
    const campground = new Campground({ title, price, geometry, location, description, author })
    campground.image = req.files.map((e) => ({ url: e.path, filename: e.filename }))
    console.log(campground)
    await campground.save()
    req.flash("success", "Successfully created a new campground!")
    console.log(campground)
    res.redirect("/campgrounds")
}
module.exports.editShowPage = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit.ejs", { campground })
}
module.exports.editCG = async (req, res) => {
    const { id } = req.params;
    const { title, price, location, description } = req.body;
    const campground = await Campground.findByIdAndUpdate(id, { title, price, location, description })
    const image = req.files.map((e) => ({ url: e.path, filename: e.filename }))
    campground.image.push(...image)
    await campground.save()
    if (req.body.deleteImg) {
        for (let filename of req.body.deleteImg) {
            cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImg } } } })
        console.log(campground)
    }

    req.flash("success", "Successfully updated the campground!")
    res.redirect(`/campgrounds/${id}`)


}
module.exports.deleteCG = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground!")
    res.redirect("/campgrounds")
}
module.exports.newShowPage = (req, res) => {
    res.render("campgrounds/new.ejs")
}
module.exports.checkCG = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author")
    if (!campground) {
        req.flash("error", "Oops! Campground Not Found!");
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show.ejs", { campground })
}