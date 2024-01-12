const Listing = require('../models/listing.js');
const initData = require("./data.js");
const mongoose = require('mongoose');
main()
.then(result => {
    console.log("Connected to Db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

async function createDB(){
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner : "652f22bfcffb1421dab7397d"}))
    await Listing.insertMany(initData.data);
    console.log("database initialized");

}

createDB();