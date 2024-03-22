const fs = require('fs');
const ejs = require('ejs');

const utils = {
    decoficarUrl: function (url) {
        let propriedades = url.split('&');
        let query = {};
        for (let propriedade of propriedades) {
            let [ variavel, valor ] = propriedade.split('=');
            query[variavel] = valor;
        }
        return query;
    },

    renderizarEjs: function (res, arquivo, dados) {
        let texto = fs.readFileSync(arquivo, 'utf-8');
        let html = ejs.render(texto, dados);
    
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(html);
        res.end();
    },

    renderizarJSON: function (res, dados, status=200) {
        res.writeHead(status, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(dados));
        res.end();
    },

    getCorpo: function (req) {
        return new Promise((resolve, reject) => {
            let corpoTexto = '';
            let i = 0;
            req.on('data', function (pedaco) {
                corpoTexto += pedaco;
                console.log(i++, corpoTexto);
            });
            req.on('end', () => {
                let corpo = utils.decoficarUrl(corpoTexto);
                
                resolve(corpo);
            });
        });
        
    }
}

module.exports = utils;