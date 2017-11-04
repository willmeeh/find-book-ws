const _ = require('lodash');
const fs = require('fs');
var encoding = require("encoding");
var iconv = require('iconv-lite');
const request = require('request');

const findBook = (req, res) => {
    var id = req.params.id;

    var bookName = req.params.bookName;
    console.log(bookName);

    const libUrl = `https://biblio.unisc.br/biblioteca/index.php?rs=ajax_resultados&rst=&rsrnd=1509817429993&rsargs[]=20&rsargs[]=0&rsargs[]=L&rsargs[]=${bookName}&rsargs[]=1%2C&rsargs[]=1%2C&rsargs[]=palavra&rsargs[]=&rsargs[]=&rsargs[]=&rsargs[]=&rsargs[]=&rsargs[]=&rsargs[]=&rsargs[]=obra&rsargs[]=59fdfc1cd77ef&rsargs[]=&rsargs[]=&rsargs[]=&rsargs[]=`;

    request(libUrl, {
        encoding: null
    }, function (error, resp, body) {
        if (error) {
            console.log(libUrl + " : " + error);
        } else {

            let html = iconv.decode(new Buffer(body), "ISO-8859-1");
            // let html = iconv.decode(new Buffer(body), "ISO-8859-1").toString().replace(/\s/g, '');
            fs.writeFileSync('response.txt', html);
            let obraIndexFrom = html.search('( Livro )');
            html = html.substring(obraIndexFrom + 54, html.length);
            let finalObraIndex = html.search('table class');
            let obra = html.substring(0, finalObraIndex - 88);
            obra = cleanHtml(obra);


            let nChamadaIndex = html.search('chamada:<strong>&nbsp;')
            html = html.substring(nChamadaIndex + 22, html.length);
            let nChamadaIndexEnd = html.search('</strong>')
            let nChamada = html.substring(0, nChamadaIndexEnd);

            let acervoIndex = html.search('Acervo: </br>')
            html = html.substring(acervoIndex + 13, html.length);
            let acervoIndexEnd = html.search('</div>')
            let acervo = html.substring(0, acervoIndexEnd);
            if (acervo) {
                const detalhesExemplarURL = `https://biblio.unisc.br/biblioteca/index.php?rs=ajax_dados_exemplar&rst=&rsrnd=1509835765109&rsargs[]=${acervo}&rsargs[]=%2C`;

                request(detalhesExemplarURL, {
                    encoding: null
                }, function (error, resp, bodyExemplares) {
                    if (error) {
                        console.log(libUrl + " : " + error);
                    } else {

                        let exemplaresHtml = iconv.decode(new Buffer(bodyExemplares), "ISO-8859-1");
                        fs.writeFileSync('response.txt', exemplaresHtml);
                        let exemplaresIndex = exemplaresHtml.search('txt_acervo10')
                        exemplaresHtml = exemplaresHtml.substring(exemplaresIndex + 15, exemplaresHtml.length);
                        let exemplaresIndexEnd = exemplaresHtml.search('</font>')
                        let exemplares = exemplaresHtml.substring(0, exemplaresIndexEnd);
                        exemplares = parseInt(exemplares);
                        if (exemplares && typeof exemplares === 'number') {
                            if (exemplares > 0) {
                                return res.send({
                                    obra,
                                    acervo,
                                    nChamada,
                                    exemplares
                                });
                            } else {
                                return res.send({
                                    'INFO': 'Exemplares indisponíveis'
                                });
                            }
                        } else {
                            return res.send({
                                'ERRO': 'Ocorreu algum erro durante o processo de mineração de texto'
                            });
                        }
                    }
                });
            } else {
                return res.send({
                    'ERRO': 'Acervo não encontrado'
                });
            }
        }
    });

};

const cleanHtml = (html) => {
    //Remove as tags html
    let htmlCleaned = html.replace(/<\/?[^>]+(>|$)/g, '');
    //Remove os espacos em braco
    return htmlCleaned.replace(/ +(?= )/g, '');;
}

module.exports = {
    findBook,
};