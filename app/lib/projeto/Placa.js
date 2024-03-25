async function listar() {
    let divPlacas = document.querySelector('#placas');
    if (!divPlacas) {
        console.error('Elemento #placas não encontrado.');
        return;
    }

    divPlacas.innerText = 'Carregando...';

    try {
        let resposta = await fetch('/placas');
        let placas = await resposta.json();

        divPlacas.innerHTML = '';

        for (let placa of placas) {
            let linha = document.createElement('tr');
            let colunaNome = document.createElement('td');
            let colunaLado = document.createElement('td');
            let colunaIdPapel = document.createElement('td');
            let colunaSenha = document.createElement('td');
            let colunaAcoes = document.createElement('td');
            let botaoEditar = document.createElement('button');
            let botaoApagar = document.createElement('button');

            colunaNome.innerText = placa.nome;
            colunaLado.innerText = placa.lado;
            colunaIdPapel.innerText = placa.id_papel;
            colunaSenha.innerText = placa.senha;

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

            linha.appendChild(colunaNome);
            linha.appendChild(colunaLado);
            linha.appendChild(colunaIdPapel);
            linha.appendChild(colunaSenha);
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
        if (confirm('Quer apagar o pentágono #' + id + '?')) {
            let resposta = await fetch('/placas/' + id, {
                method: 'delete',
            });

            let respostaJson = await resposta.json();
            let mensagem = respostaJson.mensagem;
            divResposta.innerText = traducoes['pt-BR'][mensagem];

            await listar();
        }
    } catch (error) {
        console.error('Erro ao apagar pentágono:', error);
    }
}
