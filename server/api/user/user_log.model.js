'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserLogSchema = new Schema({
  name: String,
  email: { type: String, lowercase: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  role: {
    type: String,
    default: 'user'
  },
  hashedPassword: String,
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {},
  github: {},
  stripe_cust_id: String,
  stripe_payment_date: Date,
  recursive: { type: Boolean, default: true},
  created_at: Date
});

module.exports = mongoose.model('UserLog', UserLogSchema);
