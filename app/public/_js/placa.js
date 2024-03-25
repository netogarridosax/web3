async function calcularArea() {
   /* console.log('teste1');*/
    try {
        let inputNome = document.querySelector('[name=nome]');
        let nome = inputNome.value;
        let inputLado = document.querySelector('[name=lado]');
        let lado = parseFloat(inputLado.value);
        let inputIdPapel = document.querySelector('[name=id_papel]');
        let idPapel = parseFloat(inputIdPapel.value);
        let inputSenha = document.querySelector('[name=senha]');
        let senha = inputSenha.value;

        let placa = { nome, lado, id_papel: idPapel, senha };

        if (idPapel === 0 || isNaN(idPapel)) {
            await inserir(placa);
        } else {
            await editar(placa, idPapel);
        }

        exibirDadosFormulario(nome, lado, idPapel, senha);
    } catch (error) {
        console.error('Erro ao processar área:', error);
    }
}

async function inserir(placa) {
    try {
        let divResposta = await getOrCreateMensagemDiv();

        let dados = new URLSearchParams(placa);

        let resposta = await fetch('/placas', {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: dados
        });

        if (resposta.status === 200) {
            divResposta.classList.add('pequeno');
            divResposta.classList.remove('grande');
        } else {
            divResposta.classList.add('grande');
            divResposta.classList.remove('pequeno');
        }

        let respostaJson = await resposta.json();
        let mensagem = respostaJson.mensagem;
        divResposta.innerText = traducoes['pt-BR'][mensagem];
    } catch (error) {
        console.error('Erro ao inserir placa:', error);
    }
}

function exibirDadosFormulario(nome, lado, idPapel, senha) {
    let dadosFormularioDiv = document.querySelector('#dadosFormulario');
    dadosFormularioDiv.innerHTML = `<p>Dados do Formulário:</p>
                                    <ul>
                                        <li><strong>Nome:</strong> ${nome}</li>
                                        <li><strong>Lado:</strong> ${lado}</li>
                                        <li><strong>ID Papel:</strong> ${idPapel}</li>
                                        <li><strong>Senha:</strong> ${senha}</li>
                                    </ul>`;
}

async function getOrCreateMensagemDiv() {
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));

    let divResposta = document.querySelector('#mensagem');

    if (!divResposta) {
        divResposta = document.createElement('div');
        divResposta.id = 'mensagem';
        document.body.appendChild(divResposta);
    }

    return divResposta;
}

async function editar(placa, id) {
    try {
        let divResposta = await getOrCreateMensagemDiv();

        let dados = new URLSearchParams(placa);

        let resposta = await fetch('/placas/' + id, {
            method: 'put',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: dados
        });

        if (resposta.status === 200) {
            divResposta.classList.add('pequeno');
            divResposta.classList.remove('grande');
        } else {
            divResposta.classList.add('grande');
            divResposta.classList.remove('pequeno');
        }

        let respostaJson = await resposta.json();
        let mensagem = respostaJson.mensagem;
        divResposta.innerText = traducoes['pt-BR'][mensagem];
    } catch (error) {
        console.error('Erro ao editar placa:', error);
    }
}

async function listar() {
    let divPlacas = document.querySelector('#placas');
    divPlacas.innerText = 'Carregando...';

    try {
        let resposta = await fetch('/placas');
        let placas = await resposta.json();

        divPlacas.innerHTML = '';

        for (let placa of placas) {
            let linha = document.createElement('tr');

            for (let propriedade in placa) {
                if (placa.hasOwnProperty(propriedade)) {
                    let coluna = document.createElement('td');
                    coluna.innerText = placa[propriedade];
                    linha.appendChild(coluna);
                }
            }

            let colunaAcoes = document.createElement('td');
            let botaoEditar = document.createElement('button');
            let botaoApagar = document.createElement('button');

            botaoEditar.innerText = 'Editar';
            botaoEditar.onclick = function () {
                formEditar(placa.id);
            };

            botaoApagar.onclick = function () {
                apagar(placa.id);
            };
            botaoApagar.innerText = 'Apagar';

            colunaAcoes.appendChild(botaoEditar);
            colunaAcoes.appendChild(botaoApagar);

            linha.appendChild(colunaAcoes);
            divPlacas.appendChild(linha);
        }
    } catch (error) {
        console.error('Erro ao listar:', error);
        divPlacas.innerText = 'Erro ao obter a lista de placas';
    }
}

async function apagar(id) {
    try {
        let divResposta = await getOrCreateMensagemDiv();
        if (confirm('Quer apagar o placa #' + id + '?')) {
            let resposta = await fetch('/placas/' + id, {
                method: 'delete',
            });

            let respostaJson = await resposta.json();
            let mensagem = respostaJson.mensagem;
            divResposta.innerText = traducoes['pt-BR'][mensagem];

            await listar();
        }
    } catch (error) {
        console.error('Erro ao apagar placa:', error);
    }
}
