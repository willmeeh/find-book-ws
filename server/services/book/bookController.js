const _ = require('lodash');
const fs = require('fs');
var encoding = require("encoding");
var iconv = require('iconv-lite');
const request = require('request');

const find = (req, res) => {
    var param = req.params.param;
    var paramToInt = parseInt(param);

    var count = req.params.count;

    console.log(param);
    if (paramToInt && typeof paramToInt === 'number' && paramToInt > 0) {
        getBook(paramToInt, count).then((jsonResponse) => {
            res.send({ jsonResponse });
        }).catch((e) => {
            res.send(e);
        });
    } else if (typeof param === 'string') {
        getBook(param, count).then((jsonResponse) => {
            res.send({ jsonResponse });
        }).catch((e) => {
            res.send(e);
        });
    } else {
        res.send({
            ERRO: 'Parâmetro informado inválido'
        });
    }
};

const getBook = (param, count) => {
    return new Promise((resolve, reject) => {

        if (!count) {
            count = 20;
        }

        const libUrl = `https://biblio.unisc.br/biblioteca/index.php?rs=ajax_resultados&rst=&rsrnd=1509817429993&rsargs[]=${count}&rsargs[]=0&rsargs[]=L&rsargs[]=${param}&rsargs[]=1%2C&rsargs[]=1%2C&rsargs[]=palavra&rsargs[]=&rsargs[]=&rsargs[]=&rsargs[]=&rsargs[]=&rsargs[]=&rsargs[]=&rsargs[]=obra&rsargs[]=59fdfc1cd77ef&rsargs[]=&rsargs[]=&rsargs[]=&rsargs[]=`;

        request(libUrl, {
            encoding: null
        }, function (error, resp, body) {
            if (error) {
                console.log(libUrl + " : " + error);
                return reject(error);
            } else {
                let html = iconv.decode(new Buffer(body), "ISO-8859-1");

                const callback = (result) => {
                    return resolve(result);
                }
                // Caso o parametro seja um inteiro, filtra pelo acervo
                if (typeof paramToInt === 'number' && paramToInt > 0) {
                    mineHtml(html, param, callback);
                } else {
                    mineHtml(html, undefined, callback);
                }
            }
        });
    });
};

const mineHtml = (html, id, callback, arr) => {

    if (!arr) {
        arr = [];
    }

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
    let acervo = parseInt(html.substring(0, acervoIndexEnd));

    if (acervo && typeof acervo === 'number') {
        if (id === acervo || id === undefined) {

            const detalhesExemplarURL = `https://biblio.unisc.br/biblioteca/index.php?rs=ajax_dados_exemplar&rst=&rsrnd=1509835765109&rsargs[]=${acervo}&rsargs[]=%2C`;

            request(detalhesExemplarURL, {
                encoding: null
            }, function (error, resp, bodyExemplares) {
                if (error) {
                    console.log(libUrl + " : " + error);
                    return callback(error);
                } else {

                    let exemplaresDisponiveisHtml = iconv.decode(new Buffer(bodyExemplares), "ISO-8859-1");
                    let exemplaresIndex = exemplaresDisponiveisHtml.search('txt_acervo10')
                    exemplaresDisponiveisHtml = exemplaresDisponiveisHtml.substring(exemplaresIndex + 15, exemplaresDisponiveisHtml.length);
                    let exemplaresIndexEnd = exemplaresDisponiveisHtml.search('</font>')
                    let exemplaresDisponiveis = exemplaresDisponiveisHtml.substring(0, exemplaresIndexEnd);
                    exemplaresDisponiveis = parseInt(exemplaresDisponiveis);
                    if (exemplaresDisponiveis && typeof exemplaresDisponiveis === 'number') {
                        arr.push({
                            obra,
                            acervo,
                            nChamada,
                            exemplaresDisponiveis
                        })
                        mineHtml(html, id, callback, arr);
                        
                    } else {
                        return callback(arr);
                    }
                }
            });
        } else {
            mineHtml(html, id, callback);
        }
    } else {
        return callback(arr);
    }
}

const cleanHtml = (html) => {
    //Remove as tags html
    let htmlCleaned = html.replace(/<\/?[^>]+(>|$)/g, '');
    //Remove os espacos em braco
    return htmlCleaned.replace(/ +(?= )/g, '');;
}

module.exports = {
    find,
};