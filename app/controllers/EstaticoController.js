let fs = require('fs');
let path = require('path');

class EstaticoController {
    async procurar(req, res) {
        try {
            const caminho = path.normalize('./public' + req.url).replace(/^(\.\.[\/\\])+/, '');
            let dados = fs.readFileSync(caminho);
            res.writeHead(200);
            res.write(dados);
            res.end();
        } catch (e) {
            this.naoEncontrado(req, res);
        }
    }

    naoEncontrado(req, res) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write(`<!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
        </head>
        <body>`);
        res.write('<h1>Não encontrado!</h1>');
        res.write(`</body>
        </html>`);
        res.end();
    }
}

module.exports = EstaticoController;