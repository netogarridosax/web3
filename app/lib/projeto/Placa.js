// Esperar pelo carregamento completo da página antes de chamar a função listar()
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
        listar();
    });
}

async function calcularArea() {
    console.log('teste1');
    try {
        let inputNome = document.querySelector('[name=nome]');
        let inputLado = document.querySelector('[name=lado]');
        let inputIdPapel = document.querySelector('[name=id_papel]');
        let inputSenha = document.querySelector('[name=senha]');

        if (!inputNome || !inputLado || !inputIdPapel || !inputSenha) {
            console.error('Elementos de entrada não encontrados.');
            return;
        }

        let nome = inputNome.value;
        let lado = parseFloat(inputLado.value);
        let idPapel = parseFloat(inputIdPapel.value);
        let senha = inputSenha.value;

        let pentagono = { nome, lado, id_papel: idPapel, senha };

        if (idPapel === 0 || isNaN(idPapel)) {
            await inserir(pentagono);
        } else {
            await editar(pentagono, idPapel);
        }

        exibirDadosFormulario(nome, lado, idPapel, senha);
    } catch (error) {
        console.error('Erro ao processar área:', error);
    }
}

async function listar() {
    let divPentagonos = document.querySelector('#pentagonos');
    if (!divPentagonos) {
        console.error('Elemento #pentagonos não encontrado.');
        return;
    }

    divPentagonos.innerText = 'Carregando...';

    try {
        let resposta = await fetch('/pentagonos');
        let pentagonos = await resposta.json();

        divPentagonos.innerHTML = '';

        for (let pentagono of pentagonos) {
            // Restante do código...
        }
    } catch (error) {
        console.error('Erro ao listar:', error);
        divPentagonos.innerText = 'Erro ao obter a lista de pentágonos';
    }
}

async function login() {
    try {
        let nome = document.querySelector('[name=nome]').value;
        let senha = document.querySelector('[name=senha]').value;
        let divResposta = document.querySelector('#resposta');

        if (!nome || !senha) {
            console.error('Nome ou senha não fornecidos.');
            return;
        }

        let dados = new URLSearchParams({ nome, senha });
        let resposta = await fetch('logar', {
            method: 'post',
            body: dados
        });
        let json = await resposta.json();
        console.log(json);
        if (resposta.status == 200) {
            sessionStorage.setItem('token', json.token);
            window.location = '/index';
        } else {
            divResposta.innerText = json.mensagem;
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
    }
}
