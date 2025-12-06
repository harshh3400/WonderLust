const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedredirectUrl } = require("../middleware.js");
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let user = new User({ email, username });
      let newUser = await User.register(user, password);
      console.log(newUser);
      req.login(newUser, (err) => {
        if (err) {
          next(err);
        }
        req.flash("success", "Successufuly Logged In!");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  savedredirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res, next) => {
    console.log("Authentication successful! Redirecting...");
    req.flash("success", "Welcome to WonderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);

// // routes/user.js

// router.post("/login", (req, res, next) => {
//   console.log("Step 1: Route hit. Body:", req.body);

//   // Manually invoke passport to capture errors/info
//   passport.authenticate("local", (err, user, info) => {
//     // 1. Check for System/DB Errors
//     if (err) {
//       console.log("Step 2: Error during authentication:", err);
//       return next(err);
//     }

//     // 2. Check if User was found/password matched
//     if (!user) {
//       console.log("Step 2: Authentication failed. Reason:", info);
//       req.flash("error", "Invalid username or password");
//       return res.redirect("/login");
//     }

//     // 3. Attempt to save session (Login)
//     console.log("Step 2: User verified. Logging in...", user.username);
//     req.logIn(user, (err) => {
//       if (err) {
//         console.log("Step 3: Login/Session Save failed:", err);
//         return next(err);
//       }

//       console.log("Step 3: Login successful! Redirecting...");
//       req.flash("success", "Welcome back to WonderLust!");
//       res.redirect("/listings");
//     });
//   })(req, res, next); // <--- Important: This invokes the strategy
// });

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "You are Logged Out!");
    res.redirect("/listings");
  });
});
module.exports = router;
