const User = require("../models/user.js");

module.exports.signup = async (req, res, next) => {
  try {
    let { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUseruser = await User.register(newUser, password);
    console.log(registeredUseruser);
    req.login(registeredUseruser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User registerd successfully");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("failure", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderSignupForm = (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welocome back to Wanderlust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};
