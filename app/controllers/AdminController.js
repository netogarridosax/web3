// controllers/AdminController.js
const getAdmin = require('../models/Admin');
const getSequelize = require('../lib/database');

class AdminController {
    constructor() {
        this.Admin = null;
        getSequelize().then((sequelize) => {
            getAdmin(sequelize).then((model) => {
                this.Admin = model;
            });
        });
    }

    async login(req, res) {
        const { nome, senha } = req.body;
        const admin = await this.Admin.findOne({ where: { nome } });
    
        if (!admin) {
            
            return res.status(400).send('Administrador não encontrado');
        }
    
        if (admin.senha !== senha) {
            
            return res.status(400).send('Senha incorreta');
        }
    
        
        req.session.adminId = admin.id;
        req.flash('success', 'Logado com sucesso');
        res.redirect('/admin');
    }

 
    showLoginForm(req, res) {
    res.render('admin/login', { messages: req.flash() });
}

    async create(req, res) {
        const { nome, senha } = req.body;
        const admin = await this.Admin.create({ nome, senha });
        res.redirect('/admins');
    }

    async list(req, res) {
        const admins = await this.Admin.findAll();
        res.render('admins', { admins, messages: req.flash() });
    }

    async update(req, res) {
        const { id, nome, senha } = req.body;
        await this.Admin.update({ nome, senha }, { where: { id } });
        res.redirect('/admin');
    }

    async delete(req, res) {
        const { id } = req.params;
        await this.Admin.destroy({ where: { id } });
        res.redirect('/admin');
    }

    async getById(req, res) {
        const { id } = req.params;
        const admin = await this.Admin.findOne({ where: { id } });
        res.render('admin', { admin });
    }
}

module.exports = AdminController;