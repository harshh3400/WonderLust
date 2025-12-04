const mongoose = require("mongoose");
const Review = require("./review");
const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        : v,
  },
  price: Number,
  location: String,
  country: String,
  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;
