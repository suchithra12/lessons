'use strict';

var express = require('express');
var controller = require('./pay.controller');

var router = express.Router();

router.get('/:token_id/:name/:cust_id', controller.show);

module.exports = router;