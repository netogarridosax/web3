class AutorController {
    autor(req, res) {
        const autor = {
            nome: 'Garrido',
            formacoes: [
                'Técnico em Informática para Internet',
                'Instituto Federal do Ceará',
                'Ano: 2023'
            ],
            experiencias: [
                'Militar do Exército Brasileiro',
                'Ano: Desde 2017'
            ]
        };

        res.render('autor', autor);
    }
}

module.exports = AutorController;
