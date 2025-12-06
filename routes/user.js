const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedredirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    savedredirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
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

router.get("/logout", userController.logout);
module.exports = router;
