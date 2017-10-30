require('./server/config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const requireDir = require('require-dir');

//const { mongoose } = require('./server/db/mongoose');

// Routes

var app = express();
app.use(bodyParser.json());

// Middlewares

app.listen(process.env.PORT, () => {
    console.log(`Server listen on port ${process.env.PORT}`);
});
