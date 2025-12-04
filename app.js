const express = require("express");
const mongoose = require("mongoose");
const mongoose_URL = "mongodb://127.0.0.1:27017/wonderLust";
const app = express();
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejs = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
app.use(methodOverride("_method"));
/*This is setting up the view engine and static files*/
app.engine("ejs", ejs);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
/*This is connecting to the database*/
main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log("Faild to connect to db!");
  });
async function main() {
  await mongoose.connect(mongoose_URL);
}
app.listen(8080, () => {
  console.log("Server is Litening on port:8080}");
});
app.get("/", (req, res) => {
  res.send("Hello Route");
});

app.get("/listingtest", async (req, res) => {
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
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
});

//new listing
app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});

//create listing
app.post(
  "/listings",
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
    await newListing.save();
    res.redirect("/listings");
  })
);

//show route
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  res.render("./listings/show.ejs", { list });
});

//edit route
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  res.render("./listings/edit.ejs", { list });
});

//update route
app.put("/listings/:id", async (req, res) => {
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
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  // res.status(statusCode).send(message);
  res.render("listings/error.ejs", { err });
});
