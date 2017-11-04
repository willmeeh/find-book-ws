const _ = require('lodash');
const axios = require('axios');
const fs = require('fs');
var encoding = require("encoding");
var iconvlite = require('iconv-lite');


const findBook = (req, res) => {
    var id = req.params.id;

    var bookName = req.params.bookName;
    console.log(bookName);
    const libUrl = `https://biblio.unisc.br/biblioteca/index.php?rs=ajax_resultados&rst=&rsrnd=1509817429993&rsargs[]=20&rsargs[]=0&rsargs[]=L&rsargs[]=${bookName}&rsargs[]=1%2C&rsargs[]=1%2C&rsargs[]=palavra&rsargs[]=&rsargs[]=&rsargs[]=&rsargs[]=&rsargs[]=&rsargs[]=&rsargs[]=&rsargs[]=obra&rsargs[]=59fdfc1cd77ef&rsargs[]=&rsargs[]=&rsargs[]=&rsargs[]=`;

    axios({
        method: 'get',
        url: libUrl,
        headers: {
            'Content-Type': 'text/html; charset=iso-8859-1'
        }
    }).then((response) => {
        

        // let html =  encoding.convert(response.data, 'UTF-8').toString();
        let html =  iconvlite.decode(response.data, 'UTF-8');        
        console.log(html);
        // let html = response.data.toString();

        fs.writeFileSync('response.txt', html);

        let obraIndexFrom = html.search('link_azul');
        let obraIndexTo = html.search('( Livro )');
        console.log(html.search('link_azul'));
        console.log(html.search('( Livro )'));

        let obra = html.substring(obraIndexFrom, obraIndexTo);
        console.log(obra);

        res.header("Content-Type", "application/json; charset=utf-8");
        return res.send({
            obra: obra
        });
    }).catch((e) => {
        console.log(e)
        return res.send({
            e
        });
    });



    // return res.send({
    //     id,
    //     bookName
    // });
};

module.exports = {
    findBook,
};