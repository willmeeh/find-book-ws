require('./server/config/config');

const _ = require('lodash');
const express = require('express');

const { bookRouter } = require('./server/services/book/bookRouter');
const { shelfRouter } = require('./server/services/shelf/shelfRouter');

var app = express();

app.use(express.static(__dirname + '/public'));

app.use('/book', bookRouter);
app.use('/shelf', shelfRouter);


app.listen(process.env.PORT, () => {
    console.log(`Server listen on port ${process.env.PORT}`);
});
