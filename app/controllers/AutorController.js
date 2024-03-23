class AutorController {
    index(req, res) {
        let autor = {
            nome: 'Garrido',
            formacoes: [
                'Cursando Técnico em Informática para Internet (IFCE)',
            ],
            experienciaProfissional: [
                {
                    cargo: 'Militar do Exército Brasileiro',
                    departamento: 'PQ R MNT/10º RM',
                    ano: 'Desde de 2017'
                },
               
            ]
        };

        res.render('autor', { autor }); 
    }
}

module.exports = AutorController;
