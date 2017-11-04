require('./server/config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const { findBookRouter } = require('./server/routes/findBookRouter');

var app = express();
app.use(bodyParser.json());
app.use('/', findBookRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server listen on port ${process.env.PORT}`);
});
