const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const Utils = require('../../utils/utils');
const { shelfs } = require('./shelfs');

const rootDir = process.cwd();
const imagesDir = path.join(rootDir, 'images')

const find = (req, res) => {
    let nLivro = req.params.nLivro;
    nLivro = parseFloat(Utils.removeTextFromNumber(nLivro));

    const shelfName = getShelfImgName(nLivro);
    console.log('shelfName', shelfName)
    let shelfPath;
    if (shelfName) {
        shelfPath = path.join(imagesDir, shelfName);
    } else {
        shelfPath = path.join(imagesDir, 'not-found.jpg');
    }

    var img = fs.readFileSync(shelfPath);
    res.writeHead(200, { 'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
}

const getShelfImgName = (nLivro) => {
    // console.log('shelfs', shelfs)
    const shelfsFounded = shelfs.filter((shelf) => {
        if (nLivro > parseFloat(shelf.min_range) && nLivro < parseFloat(shelf.max_range)) {
            return true;
        }
    })[0];

    if (shelfsFounded) {
        return shelfsFounded.img_name;
    } else {
        return false;
    }
}

module.exports = {
    find,
};