// const express = require("express");
// const mongoose = require("mongoose");
// const mongoose_URL = "mongodb://127.0.0.1:27017/wonderLust";
// const app = express();
// const path = require("path");
// const methodOverride = require("method-override");
// const ejs = require("ejs-mate");
// const listings = require("./routes/listing");
// const reviews = require("./routes/review");
// const userRouter = require("./routes/user.js");
// const ExpressError = require("./utils/ExpressError");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user.js");
// const session = require("express-session");
// const flash = require("connect-flash");
// const sessionOptions = {
//   secret: "mysecretsessioncode",
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     httpOnly: true,
//   },
// };
// app.use(express.urlencoded({ extended: true }));
// app.use(session(sessionOptions));
// app.use(flash());
// app.use((req, res, next) => {
//   res.locals.success = req.flash("success");
//   next();
// });
// app.use(passport.initialize());
// app.use(passport.session());
// app.use("/", userRouter);
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use(methodOverride("_method"));
// /*This is setting up the view engine and static files*/
// app.engine("ejs", ejs);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "public")));

// app.use(express.static(path.join(__dirname, "public")));
// /*This is connecting to the database*/
// main()
//   .then(() => {
//     console.log("Connected to db");
//   })
//   .catch((err) => {
//     console.log("Faild to connect to db!");
//   });
// async function main() {
//   await mongoose.connect(mongoose_URL);
// }
// app.listen(8080, () => {
//   console.log("Server is Litening on port:8080}");
// });
// app.get("/", (req, res) => {
//   res.send("Hello Route");
// });

// //demoUser
// app.get("/demouser", async (req, res) => {
//   let user = new User({ email: "h@gmail.com", username: "harshad" });
//   let newUser = await User.register(user, "password123");
//   res.send(newUser);
// });

// app.use("/listings", listings);
// app.use("/listings/:id/reviews", reviews);
// app.all(/(.*)/, (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));
// });
// app.use((err, req, res, next) => {
//   let { statusCode = 500, message = "Something went wrong!" } = err;
//   // res.status(statusCode).send(message);
//   res.render("listings/error.ejs", { err });
// });

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejs = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// 3. ESSENTIAL MIDDLEWARE (Parsing & Static)
// Must be FIRST to handle form data and static files
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejs);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Models
const User = require("./models/user.js");

// Errors
const ExpressError = require("./utils/ExpressError");

// Route Imports
const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/user.js");

const mongoose_URL = "mongodb://127.0.0.1:27017/wonderLust";

// 1. DATABASE CONNECTION
async function main() {
  await mongoose.connect(mongoose_URL);
}
main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log("Failed to connect to db!", err);
  });

// 2. APP CONFIGURATION (Views & EJS)

// 4. SESSION CONFIGURATION
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

// 5. AUTHENTICATION (Passport)
// Must run AFTER session configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 6. LOCALS MIDDLEWARE
// Makes 'success', 'error', and 'currUser' available in ALL templates
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// 7. ROUTES
// Demo User Route
app.get("/demouser", async (req, res) => {
  let user = new User({ email: "h@gmail.com", username: "harshad" });
  let newUser = await User.register(user, "password123");
  res.send(newUser);
});

// Mount Routes
app.use("/", userRouter);
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);

app.get("/", (req, res) => {
  res.send("Hello Route");
});

// 8. ERROR HANDLING
// FIX: Use regex /(.*)/ instead of "*" for Express 5 compatibility
app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listings/error.ejs", { err });
});

// 9. SERVER START
app.listen(8080, () => {
  console.log("Server is Listening on port: 8080");
});
