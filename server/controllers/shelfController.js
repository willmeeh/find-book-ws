const _ = require('lodash');

const findBook = (req, res) => {
    var id = req.params.id;
    return res.send({
        id
    });
};

module.exports = {
    findBook,
};