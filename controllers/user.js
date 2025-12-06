const User = require("../models/user.js");
module.exports.signup = async (req, res) => {
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
};
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};
module.exports.login = async (req, res, next) => {
  console.log("Authentication successful! Redirecting...");
  req.flash("success", "Welcome to WonderLust");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "You are Logged Out!");
    res.redirect("/listings");
  });
};
