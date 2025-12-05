const express = require("express");
const mongoose = require("mongoose");
const mongoose_URL = "mongodb://127.0.0.1:27017/wonderLust";
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejs = require("ejs-mate");
const listings = require("./routes/listing");
const reviews = require("./routes/review");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const sessionOptions = {
  secret: "mysecretsessioncode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());
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
app.use((req, res, next) => {
  res.locals.SUCCESS = req.flash("success");

  next();
});
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  // res.status(statusCode).send(message);
  res.render("listings/error.ejs", { err });
});
