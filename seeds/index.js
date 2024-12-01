const path = require('path'); // Import the path module
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const axios = require('axios');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

console.log(process.env.UNSPLASH_API_KEY);


mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});

    // Fetch photos from Unsplash API
    const photosResponse = await axios.get('https://api.unsplash.com/collections/496276/photos', {
        params: {
            client_id: process.env.UNSPLASH_API_KEY,
            per_page: 50 // Fetch 50 photos in a single request (adjust as necessary)
        }
    });

    const photos = photosResponse.data;

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const randomPhoto = photos[Math.floor(Math.random() * photos.length)];

        const camp = new Campground({
            author: '674c9ef0347bdfd9c1287f96',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: randomPhoto.urls.regular,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, quae.',
            price: Math.floor(Math.random() * 20) + 10
        });

        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});