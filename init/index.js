const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

async function initDb() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderLust");
  console.log("Database connected");
  await Listing.deleteMany({});
  console.log("Old listings removed");
  await Listing.insertMany(initdata.data);
  console.log("New listings added");
  mongoose.connection.close();
}
initDb();
