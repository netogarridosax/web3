const Usuario = require("./usuario")
const bcrypt = require('bcrypt')

class UsuariosDao {
    constructor() {
        this.usuarios = [];
    }
    listar() {
        return this.usuarios;
    }

    inserir(usuario) {
        this.validar(usuario);
        usuario.senha = bcrypt.hashSync(usuario.senha, 10);
        this.usuarios.push(usuario);
    }

    alterar(id, usuario) {
        this.validar(usuario);
        this.usuarios[id] = usuario;
    }

    apagar(id) {
        this.usuarios.splice(id, 1);
    }

    validar(usuario) {
        if (usuario.nome == '') {
            throw new Error('mensagem_nome_em_branco');
        }
        if (!usuario.senha) {
            throw new Error('mensagem_senha_em_branco');
        }
        if (!usuario.papel) {
            throw new Error('mensagem_papel_em_branco');
        }
    }
    autenticar(nome, senha) {
        for (let usuario of this.listar()) {
            if (usuario.nome == nome && bcrypt.compareSync(senha, usuario.senha)) {
                return usuario;
            }
        }
        return null;
    }

}

module.exports = UsuariosDao;