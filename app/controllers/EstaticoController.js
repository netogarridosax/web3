let fs = require('fs');
let path = require('path');

class EstaticoController {
    async procurar(req, res) {
        try {
            const caminho = path.normalize('./public' + req.url).replace(/^(\.\.[\/\\])+/, '');
            console.log('Caminho do arquivo:', caminho);
            let dados = fs.readFileSync(caminho);
            res.writeHead(200);
            res.write(dados);
            res.end();
        } catch (e) {
            this.naoEncontrado(req, res);
        }
    }

    naoEncontrado(req, res){
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write(`<!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>`)
        res.write('<h1>Não encontrado!</h1>');
        res.write('</body>')
        res.end();
    }  
}

module.exports = EstaticoController;