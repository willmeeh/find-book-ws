require('./server/config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const { bookRouter } = require('./server/services/book/bookRouter');
const { shelfRouter } = require('./server/services/shelf/shelfRouter');

var app = express();
app.use(bodyParser.json());
app.use('/book', bookRouter);
app.use('/shelf', shelfRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server listen on port ${process.env.PORT}`);
});
