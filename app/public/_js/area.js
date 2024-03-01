function calcularArea() {

    let inputNome = document.querySelector('[name=nome]');
    let inputLado = document.querySelector('[name=lado]');
    let divResposta = document.querySelector('#resposta');
    let nome = inputNome.value;
    let lado = parseFloat(inputLado.value);
    if (isNaN(lado)) {
        alert('Por favor, insira um valor numérico para o lado.');
        return;
    }
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
