require('./server/config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const { shelfRouter } = require('./server/routes/shelfRouter');

var app = express();
app.use(bodyParser.json());
app.use('/shelf', shelfRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server listen on port ${process.env.PORT}`);
});
