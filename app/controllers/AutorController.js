const utils = require("../lib/utils")

class AutorController {
    autor(req, res) {
        let autor = {
            nome: 'Garrido',
            formacoes: [
                'cursando técnico em informática para web'
            ]
        }

        utils.renderizarEjs(res, './views/autor.ejs', autor);
    }
}
module.exports = AutorController;