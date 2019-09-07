const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
const userQueries = require("../db/queries.users.js");

module.exports = {
  upgrade(req, res, next) {
    res.render("static/premium", {
      publishableKey
    });
  },
  payment(req, res, next) {
    let payment = 1500;
    stripe.customers
      .create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
      })
      .then(customer => {
        stripe.charges.create({
          amount: payment,
          description: "Blocipedia Premium Membership",
          currency: "usd",
          customer: customer.id
        });
      })
      .then(charge => {
        userQueries.upgrade(req.user.dataValues.id);
        res.render("static/payment_success");
      });
  }, 
  downgrade(req, res, next) {
    userQueries.downgrade(req.user.dataValues.id);
    req.flash("notice", "You are no longer a premium user!");
    res.redirect("/");
  }
}