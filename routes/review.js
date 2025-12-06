const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Review = require("../models/review");
const validateReview = require("../utils/reviewValidation");
const { isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/reviews.js");
//review route
router.post("/", validateReview, wrapAsync(reviewController.createReview));
//delete reivew
router.delete(
  "/:reviewId",
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);
module.exports = router;
