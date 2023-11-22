const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../models/campground");
const { descriptors, places } = require("./seedHelpers")
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Connection Success");
    })
    .catch((e) => {
        console.log(e);
    })

function randTitleNum(arr) {
    return Math.floor(Math.random() * arr.length)
}

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 400; i++) {
        let randLocNum = Math.floor(Math.random() * 1000);
        let price = Math.floor(Math.random() * 30) + 10
        const newCG = new Campground({
            title: `${descriptors[randTitleNum(descriptors)]} ${places[randTitleNum(places)]}`, location: `${cities[randLocNum].city}, ${cities[randLocNum].state}`, description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique error blanditiis asperiores eligendi ratione rem nesciunt aspernatur perferendis ducimus facere eum quidem voluptatem nam voluptates nemo, officia provident eius cum Accusamus ex, temporibus, animi excepturi, sit laborum nulla modi corporis nostrum totam minima. Veritatis aliquam odio quam atque est dolor",
            image: [
                {
                    url: 'https://res.cloudinary.com/dir0qoiss/image/upload/v1698826634/yelpCamp/uxa7hhh5cnnenvxlalou.jpg',
                    filename: 'yelpCamp/uxa7hhh5cnnenvxlalou',
                },
                {
                    url: 'https://res.cloudinary.com/dir0qoiss/image/upload/v1698826880/yelpCamp/h0ceqkavere1rxii0476.jpg',
                    filename: 'yelpCamp/h0ceqkavere1rxii0476',
                },

            ], price, author: "6537d0632489a039f97b8b55", geometry: { type: "Point", coordinates: [`${cities[randLocNum].longitude}`, `${cities[randLocNum].latitude}`] }
        });
        await newCG.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })

