const express = require('express');
const shelfController = require('./shelfController');

const shelfRouter = express.Router();

shelfRouter.route('/find/:nLivro?').get(shelfController.find);

module.exports = { shelfRouter };