
class AutorController {
    index(req, res) {
        let autor = {
            nome: 'Garrido',
            formacoes: [
                'cursando técnico em informática para web'
            ]
        }

        res.render('autor', autor);
    }
}
module.exports = AutorController;