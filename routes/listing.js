const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn } = require("../middleware.js");
router.get("/listingtest", async (req, res) => {
  const newListing = new Listing({
    title: "Beautiful Beach House",
    description: "A lovely beach house with stunning ocean views.",
    image: "",
    price: 350,
    location: "Malibu, CA",
    country: "USA",
  });
  await newListing.save();
  res.send(newListing);
});
router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
});

//new listing
router.get("/new", isLoggedIn, (req, res) => {
  res.render("./listings/new.ejs");
});

//create listing
router.post(
  "/",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    // let { title, description, image, price, location, country } = req.body;
    // price = parseFloat(price);
    // const newListing = new Listing({
    //   title,
    //   description,
    //   image,
    //   price,
    //   location,
    //   country,
    // });
    if (!req.body.listing) throw new ExpressError(400, "Invalid Listing Data");
    const newListing = new Listing(req.body.listing);
    if (!newListing.description) {
      throw new ExpressError(400, "Description is required");
    }
    console.log(newListing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Added!");
    res.redirect("/listings");
  })
);

//show route
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id)
    .populate({
      path: "review",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  res.render("./listings/show.ejs", { list });
});

//edit route
router.get("/:id/edit", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  req.flash("success", "Listing Updated Successfuly!");
  res.render("./listings/edit.ejs", { list });
});

//update route
router.put("/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  let { title, description, image, price, location, country } = req.body;
  await Listing.findByIdAndUpdate(id, {
    title,
    description,
    image,
    price,
    location,
    country,
  });
  res.redirect("/listings");
});

//delete route
router.delete("/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
});
module.exports = router;
