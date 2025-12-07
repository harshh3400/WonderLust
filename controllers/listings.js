const Listing = require("../models/listing.js");

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
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
};
module.exports.createListing = async (req, res, next) => {
  if (!req.body.listing) throw new ExpressError(400, "Invalid Listing Data");
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  if (!newListing.description) {
    throw new ExpressError(400, "Description is required");
  }
  console.log(newListing);
  newListing.image = { url, filename };
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Added!");
  res.redirect("/listings");
};
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  req.flash("success", "Listing Updated Successfuly!");
  res.render("./listings/edit.ejs", { list });
};
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let { title, description, image, price, location, country } = req.body;
  let newListing = await Listing.findByIdAndUpdate(id, {
    title,
    description,
    image,
    price,
    location,
    country,
  });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = { url, filename };
    await newListing.save();
  }
  res.redirect(`/listings/${id}`);
};
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
module.exports.allListings = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};
