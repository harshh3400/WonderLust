const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Review = require("../models/review");
const validateReview = require("../utils/reviewValidation");
//review route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    console.log(listing);
    let newReview = new Review(req.body.review);
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("New Review Saved!");
    req.flash("success", "New Review Added!");
    res.redirect(`/listings/${listing._id}`);
  })
);
//delete reivew
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  })
);
module.exports = router;
