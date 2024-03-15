const Placa = require('../models/Placa');

class PlacaController {
    constructor() {
        this.Placa = null;
        Placa().then((model) => {
            this.Placa = model;
            console.log('Modelo Placa carregado:', this.Placa);
        });
    }

    calcularArea(lado) {
        lado = parseFloat(lado); // Convertendo lado em número
        const areaTriangulo = (lado ** 2 * Math.sqrt(25 + 10 * Math.sqrt(5))) / 4;
        const areaTotal = 5 * areaTriangulo;
        return areaTotal;
    }

    async create(req, res) {
        if (!this.Placa) {
            return res.status(500).send('Modelo Placa não inicializado');
        }

        const { nome, lado } = req.body;
        const placa = await this.Placa.create({ nome, lado });

        const area = this.calcularArea(lado);

        res.render('resposta', { area });
    }

    async list(req, res) {
        if (!this.Placa) {
            return res.status(500).send('Modelo Placa não inicializado');
        }

        console.log('Rota /placas chamada');
        const placas = await this.Placa.findAll();

        placas.forEach(placa => {
            placa.area = this.calcularArea(placa.lado);
        });

        console.log('Placas recuperadas do banco de dados:', placas);
        res.render('placas', { placas });
    }

    async editar(req, res) {
        if (!this.Placa) {
            return res.status(500).send('Modelo Placa não inicializado');
        }

        const { id } = req.params;
        const placa = await this.Placa.findOne({ where: { id } });
        if (!placa) {
            return res.redirect('/placas');
        }
        res.render('editar', { placa });
    }

    async update(req, res) {
        if (!this.Placa) {
            return res.status(500).send('Modelo Placa não inicializado');
        }

        console.log('Update chamado o metódo update');
        const { id, nome, lado } = req.body;
        console.log('Parameters:', id, nome, lado);
        await this.Placa.update({ nome, lado }, { where: { id } });
        res.redirect('/placas');
    }

    async delete(req, res) {
        if (!this.Placa) {
            return res.status(500).send('Modelo Placa não inicializado');
        }

        const { id } = req.params;
        await this.Placa.destroy({ where: { id } });
        req.session.messages = { success: 'Placa excluída com sucesso.' };
        res.redirect('/placas');
    }

    async getById(req, res) {
        if (!this.Placa) {
            return res.status(500).send('Modelo Placa não inicializado');
        }

        const { id } = req.params;
        const placa = await this.Placa.findOne({ where: { id } });
        res.render('placa', { placa });
    }
}

module.exports = PlacaController;
