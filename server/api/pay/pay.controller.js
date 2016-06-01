'use strict';

var _ = require('lodash');
var User = require('../user/user.model');
var UserLog = require('../user/user_log.model');

var stripe = require("stripe")(
  "sk_test_5je1MAOv6cp35z8WRSLZ47xn"
);

// var CronJob = require('cron').CronJob;

// new CronJob('00 15 10 * * *', function() { //Fire at 10:15 AM every day
//   console.log('Fire at 10:15 AM every day');
//   exports.payment_check();
// }, null, true, 'America/Los_Angeles');

// exports.payment_check = function(){
//   User.find({}, '-salt -hashedPassword', function (err, users) {
//     if(err) return res.send(500, err);
//     for (var i in users) {
//       if ( users[i].recursive == true && users[i].stripe_payment_date != undefined){
//         var today = new Date(); 
//         var todayDateOnly = new Date(today.getFullYear(),today.getMonth(),today.getDate()); //This will write a Date with time set to 00:00:00 so you kind of have date only
//         var d = new Date(users[i].stripe_payment_date);   
//         var dDateOnly = new Date(d.getFullYear(),d.getMonth(),d.getDate());
//         if (dDateOnly.getTime() === todayDateOnly.getTime()){
//           console.log("recursive charges....")
//           stripe.charges.create({
//             amount: 1499,
//             currency: 'usd',
//             customer: users[i].stripe_cust_id
//           });
//           var id = users[i].stripe_cust_id
//           console.log('Update Success! Customer with Stripe ID ' + id);
//         }
//       }
//     }
//     // res.json(200, users);
//   });
// };

exports.show = function(req, res) {
  User.findById(req.params.cust_id, function (err, user) {
    if (err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
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
          stripe.subscriptions.create({
            customer: customer.id,
            plan: "plan1"
          }, function(err, subscription) {
            console.log("Customer subscribed successfully")
          }
          );
          var id = customer.id;
          console.log('Success! Customer with Stripe ID ' + id + ' just signed up!');
          // save this customer to your database here!
          User.findById(req.params.cust_id, function (err, user) {
            if (err) { return handleError(res, err); }
            if(!user) { return res.send(404); }
            var pay_date = new Date().toString();
            var updated = _.merge(user, {"stripe_cust_id" : customer.id, "stripe_payment_date" : pay_date  });
            updated.save(function (err) {
              if (err) { return handleError(res, err); }
              console.log(user)
              // res.json(200, user);
            });
          });
          res.json(customer);
        }
      });
  });
};

exports.destroy = function(req, res) {
  User.findById(req.params.cust_id, function(err, user) {
    if(err) return res.send(500, err);
    if(!user) { return res.send(404); }
    if (user.stripe_cust_id != undefined)
    {
      stripe.customers.del(
        user.stripe_cust_id,
        function(err, confirmation) {
          console.log("Custormer strip account is deleted");
          UserLog.create(user, function(err, userlog) {
            if(err) { return handleError(res, err); }
            console.log("User object inserted into userLOg table")
            User.findByIdAndRemove(user._id, function(err, user) {
              if(err) return res.send(500, err);
              console.log("User deleted successfully..")
            });
          });
        }
      );
    }
    return res.json(201, user);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}