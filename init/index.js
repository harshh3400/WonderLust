const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
require("dotenv").config({ path: "../.env" });
async function initDb() {
  await mongoose.connect(process.env.MONGO_API);
  console.log("Database connected");
  await Listing.deleteMany({});
  console.log("Old listings removed");
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "69355f4f628623c1f189a14c",
  }));
  await Listing.insertMany(initdata.data);
  console.log("New listings added");
  mongoose.connection.close();
}
initDb();
