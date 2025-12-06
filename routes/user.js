const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
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
      req.flash("success", "Welcome to wonderLust");
      res.redirect("/listings");
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

  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res, next) => {
    console.log("Authentication successful! Redirecting...");
    res.redirect("/listings");
  }
);

// robust login route (replace your current POST /login)
// router.post("/login", (req, res, next) => {
//   console.log("POST /login body:", req.body);

//   passport.authenticate("local", (err, user, info) => {
//     if (err) {
//       console.error("Auth error:", err);
//       req.flash("error", "Authentication error");
//       return next(err); // will go to your error handler
//     }
//     if (!user) {
//       console.log("Auth failed:", info);
//       req.flash(
//         "error",
//         info && info.message ? info.message : "Invalid credentials"
//       );
//       return res.redirect("/login"); // explicitly end request
//     }
//     req.logIn(user, (err) => {
//       if (err) {
//         console.error("login error:", err);
//         return next(err);
//       }
//       console.log("Login success for user:", user.username || user.email);

//       // redirect to saved URL or default listings
//       const redirectUrl = req.session.returnTo || "/listings";
//       delete req.session.returnTo;
//       return res.redirect(redirectUrl);
//     });
//   })(req, res, next); // note immediate invocation
// });

module.exports = router;
