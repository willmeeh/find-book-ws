const express = require('express');
const bookController = require('./bookController');

const bookRouter = express.Router();

bookRouter.route('/find/:param/:count?').get(bookController.find);

module.exports = { bookRouter };