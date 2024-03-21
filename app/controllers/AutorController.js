class AutorController {
    index(req, res) {
        let autor = {
            nome: 'Garrido',
            formacoes: [
                'Técnico em Informática para Internet',
                'Instituto Federal do Ceará'
            ],
            experiencias: [
                'Militar do Exército Brasileiro'
            ]
        };

        res.render('autor', autor);
    }
}

module.exports = AutorController;