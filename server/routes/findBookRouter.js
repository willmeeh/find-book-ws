const express = require('express');
const findBookController = require('../controllers/findBookController');

const findBookRouter = express.Router();

findBookRouter.route('/findBook/:param/:count?').get(findBookController.findBook);
// findBookRouter.route('/findBook/:id/:bookName?').get(findBookController.findBook);

module.exports = { findBookRouter };