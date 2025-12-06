const Listing = require("../models/listing.js");
const Review = require("../models/review");
module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  console.log(listing);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.review.push(newReview);
  await newReview.save();
  await listing.save();
  console.log("New Review Saved!");
  req.flash("success", "New Review Added!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
