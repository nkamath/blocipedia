const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const {
  validationResult
} = require('express-validator');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


module.exports = {
  signUpForm(req, res, next) {
    res.render("users/signup");
  },
  signInForm(req, res, next) {
    res.render("users/sign-in");
  },
  create(req, res, next) {
    let newUser = {
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array({
        onlyFirstError: true
      }));
      return res.redirect(303, req.headers.referer)
    }

    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        req.flash("error", err);
        res.redirect("/users/signup");
      } else {
        passport.authenticate("local")(req, res, () => {
          const msg = {
            to: user.email,
            from: 'test@blocipedia.com',
            subject: 'Welcome to Blocipedia!',
            text: 'Thank you for joining our community'
          };
          sgMail.send(msg);
          req.flash("notice", "You've successfully signed in, check your email for confirmation!");
          res.redirect("/");
        })
      }
    });
  },
  signIn(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array({
        onlyFirstError: true
      }));
      return res.redirect(303, req.headers.referer)
    }
    passport.authenticate("local")(req, res, function () {
      if (!req.user) {
        req.flash("notice", "Sign in failed. Please try again.")
        res.redirect("/users/sign-in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
  },
  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  }

}