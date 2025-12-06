const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn } = require("../middleware.js");
const listingsController = require("../controllers/listings.js");

//new listing
router.get("/new", isLoggedIn, listingsController.renderNewForm);
//index route
router
  .route("/")
  .get(wrapAsync(listingsController.allListings))
  .post(isLoggedIn, wrapAsync(listingsController.createListing));

router
  .route("/:id")
  .get(wrapAsync(listingsController.showListing))
  .put(isLoggedIn, wrapAsync(listingsController.updateListing))
  .delete(isLoggedIn, wrapAsync(listingsController.deleteListing));

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingsController.renderEditForm)
);

module.exports = router;
