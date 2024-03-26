function calcularArea() {

    let inputNome = document.querySelector('[name=nome]');
    let nome = inputNome.value;
    let inputLado = document.querySelector('[name=lado]');
    let lado = parseFloat(inputLado.value);
    let inputSenha = document.querySelector('[name=senha]');
    let senha = parseFloat(inputSenha.value);
    let inputPapel = document.querySelector('[name=id_papel]');
    let id_papel = parseFloat(inputPapel.value);    
}/*
    const pi = Math.PI;
    let area = (5 / 4) * Math.pow(lado, 2) * (1 / Math.tan(pi / 10));
    let div = document.createElement('div');
    div.textContent = 'Olá, ' + nome + '! Sua placa tem ' + lado + ' metros de lado. A área dela é de: ' + area.toFixed(2) + ' metros quadrados.';
    if (area > 20) {
        div.classList.add('grande');
        div.textContent += ' É um letreiro grande.';
    } else {
        div.classList.add('pequeno');
        div.textContent += ' É um letreiro pequeno.';
    }

    divResposta.append(div);
}
*/
inserir({
    nome, lado, senha, id_papel
});
listar();


let traducoes = {
'pt-BR': {
    'mensagem_senha_em_branco': 'A senha não pode ser em branco!',
    'mensagem_placa_cadastrado': 'Placa cadastrado com sucesso!',
    'mensagem_placa_apagado': 'placa apagado com sucesso!'
},
'en': {
    'mensagem_senha_em_branco': 'Password cannot be empty!'
}
}

async function inserir(placa) {
console.log('inserindo', placa);
let divResposta = document.querySelector('#resposta');
let dados = new URLSearchParams(placa);
console.log(dados);
let resposta = await fetch('placas', {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },   
    body: dados
});
if (resposta.status == 200) {
    divResposta.classList.add('pequena');
    divResposta.classList.remove('garande');
}
else {
    divResposta.classList.add('garande');
    divResposta.classList.remove('pequena');
}
let respostaJson = await resposta.json();
let mensagem = respostaJson.mensagem;
divResposta.innerText = traducoes['pt-BR'][mensagem];
}

async function listar() {
let divPlacas = document.querySelector('#placas');
divPlacas.innerText = 'Carregando...'
let resposta = await fetch('placas');
let placas = await resposta.json();
divPlacas.innerHTML = '';
for (let placa of placas) {
    let linha = document.createElement('tr');
    let colunaId = document.createElement('td');
    let colunaNome = document.createElement('td');
    let colunaNota1 = document.createElement('td');
    let colunaNota2 = document.createElement('td');
    let colunaAcoes = document.createElement('td');
    let botaoEditar = document.createElement('button');
    let botaoApagar = document.createElement('button');
    colunaId.innerText = placa.id;
    colunaNome.innerText = placa.nome;
    colunaNota1.innerText = placa.nota1;
    colunaNota2.innerText = placa.nota2;
    botaoEditar.innerText = 'Editar';
    botaoEditar.onclick = function () {
        editar(placa.id);
    }
    botaoApagar.onclick = function () {
        apagar(placa.id);
    }
    botaoApagar.innerText = 'Apagar';
    linha.appendChild(colunaId);
    linha.appendChild(colunaNome);
    linha.appendChild(colunaNota1);
    linha.appendChild(colunaNota2);
    colunaAcoes.appendChild(botaoEditar);
    colunaAcoes.appendChild(botaoApagar);
    linha.appendChild(colunaAcoes);
    divPlacas.appendChild(linha);
}
}

function editar(id) {
alert('editar' + id);
}

async function apagar(id) {
let divResposta = document.querySelector('#resposta');
if (confirm('Quer apagar o #' + id + '?')) {
    let resposta = await fetch('placas/' + id, {
        method: 'delete',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
    });
    let respostaJson = await resposta.json();
    let mensagem = respostaJson.mensagem;
    divResposta.innerText = traducoes['pt-BR'][mensagem];
    listar();
}
}
