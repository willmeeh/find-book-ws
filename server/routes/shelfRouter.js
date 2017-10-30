const express = require('express');
const shelfController = require('../controllers/shelfController');

const shelfRouter = express.Router();

shelfRouter.route('/findBook/:id').get(shelfController.findBook);

module.exports = { shelfRouter };