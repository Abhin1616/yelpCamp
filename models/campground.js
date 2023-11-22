const mongoose = require("mongoose");
const Review = require("./review")
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
})
imageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200")
})
const opts = { toJSON: { virtuals: true } }
const campgroundSchema = new Schema({
    title: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: {
        type: String
    },

    image: [imageSchema],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, opts)
campgroundSchema.virtual("properties.title").get(function () {
    return `<h5><strong><a href="/campgrounds/${this._id}">${this.title}</a></strong></h5>`;
})

campgroundSchema.post("findOneAndDelete", async function (campground) {
    if (campground.reviews.length) {
        await Review.deleteMany({ _id: { $in: campground.reviews } })
    }
})
const Campground = mongoose.model("Campground", campgroundSchema);
module.exports = Campground;