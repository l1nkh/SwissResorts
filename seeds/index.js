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
        const price = Math.floor(Math.random() * 20) + 10;
        const resort = new Resort({
            author: '65396477882f62f1af0ef50e',
            location: `${cities[random138].city}, ${cities[random138].admin_name}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251/',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.' + 
                'Expedita aspernatur culpa voluptas eos fuga quaerat libero labore consectetur,'+ 
                ' quam tempora corporis est. Saepe amet impedit ad cum distinctio blanditiis repudiandae.',
            price: price
        });
        await resort.save();
    }
}

seedDB();