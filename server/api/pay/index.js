'use strict';

var express = require('express');
var controller = require('./pay.controller');

var router = express.Router();

router.get('/:token_id/:name/:cust_id', controller.show);
router.get('/deleteAccount/:cust_id', controller.destroy);

module.exports = router;