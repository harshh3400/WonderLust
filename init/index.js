const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
require("dotenv").config({ path: "../.env" });
async function initDb() {
  await mongoose.connect(process.env.MONGO_API);
  console.log("Database connected");
  await Listing.deleteMany({});
  console.log("Old listings removed");
  await Listing.insertMany(initdata.data);
  console.log("New listings added");
  mongoose.connection.close();
}
initDb();
