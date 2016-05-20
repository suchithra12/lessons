'use strict';

var _ = require('lodash');
var User = require('../user/user.model');

var stripe = require("stripe")(
  "sk_test_5je1MAOv6cp35z8WRSLZ47xn"
);


exports.show = function(req, res) {
  console.log(req.params.token_id);
  console.log(req.params.cust_id)
  User.findById(req.params.cust_id, function (err, user) {
    if (err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    console.log("stripe_cust-id : "+ user.stripe_cust_id)
    if (user.stripe_cust_id == 'undefined' || user.stripe_cust_id == undefined){
      console.log("customer created....")
      stripe.customers.create({
        card : req.params.token_id,
        email : req.params.name
      }, function (err, customer) {
        if (err) {
          var msg = err || "unknown";
          res.send("Error while processing your payment: " + msg);
        }
        else {
          stripe.charges.create({
            amount: 1499,
            currency: 'usd',
            customer: customer.id
          });
          var id = customer.id;
          console.log('Success! Customer with Stripe ID ' + id + ' just signed up!');
          // save this customer to your database here!
          User.findById(req.params.cust_id, function (err, user) {
            if (err) { return handleError(res, err); }
            if(!user) { return res.send(404); }
            console.log(customer.id)
            var updated = _.merge(user, {"stripe_cust_id" : customer.id});
            updated.save(function (err) {
              if (err) { return handleError(res, err); }
              console.log(user)
              // res.json(200, user);
            });
          });
          res.json(customer);
        }
      });
    }
    else{
      //already created customer
      console.log("charges reviewed....")
      stripe.charges.create({
        amount: 1499,
        currency: 'usd',
        customer: user.stripe_cust_id
      });
      var id = user.stripe_cust_id
      console.log('Update Success! Customer with Stripe ID ' + id);
      // save this customer to your database here!
      res.json(user);
    }
  });


};



function handleError(res, err) {
  return res.send(500, err);
}