const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Resort = require('../models/resort');

mongoose.connect('mongodb://localhost:27017/swiss-resorts');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Resort.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random138 = Math.floor(Math.random() * 138);
        const resort = new Resort({
            location: `${cities[random138].city}, ${cities[random138].admin_name}`,
            title: `${sample(descriptors)} ${sample(places)}`
        });
        await resort.save();
    }
}

seedDB();