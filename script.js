let baralhoJogador;
let baralhoComputador;
let cartaAtual;
let cartaDoComputador;
let vitorias = 0;
let derrotas = 0;
let empates = 0;
let turno = "jogador";
let medias;
let esperandoProximaRodada = false;

function calcularMedias(baralho) {
  const totais = {
    populacao: 0,
    area: 0,
    forca: 0,
    tecnologia: 0,
    cultura: 0,
    longevidade: 0
  };

  baralho.forEach(carta => {
    for (let atributo in carta.atributos) {
      totais[atributo] += carta.atributos[atributo];
    }
  });

  const medias = {};
  for (let atributo in totais) {
    medias[atributo] = totais[atributo] / baralho.length;
  }

  return medias;
}

function escolherAtributoAcimaDaMedia(carta, medias) {
  let melhorAtributo = "";
  let maiorDiferenca = -Infinity;

  for (let atributo in carta.atributos) {
    const diferenca = carta.atributos[atributo] - medias[atributo];

    if (diferenca > maiorDiferenca) {
      maiorDiferenca = diferenca;
      melhorAtributo = atributo;
    }
  }

  return melhorAtributo;
}

function gerarHtmlCartaComRadios(carta) {
  let html = `<h2>${carta.nome}</h2>`;
  for (let atributo in carta.atributos) {
    html += `<input type="radio" name="atributo" value="${atributo}"> ${atributo}: ${carta.atributos[atributo]}<br>`;
  }
  return html;
}

function gerarHtmlCarta(carta) {
  let html = `<h2>${carta.nome}</h2>`;
  for (let atributo in carta.atributos) {
    html += `<p>${atributo}: ${carta.atributos[atributo]}</p>`;
  }
  return html;
}

function exibirCartasEDefinirVencedor(atributoSelecionado) {
  let valorJogador = cartaAtual.atributos[atributoSelecionado];
  let valorComputador = cartaDoComputador.atributos[atributoSelecionado];
  let resultado = "";

  document.querySelector("#carta-computador").innerHTML = gerarHtmlCarta(cartaDoComputador);

  if (valorJogador > valorComputador) {
    vitorias++;
    resultado = `Você venceu a rodada com o atributo ${atributoSelecionado}!`;
    baralhoJogador.push(baralhoJogador.shift());
    baralhoJogador.push(baralhoComputador.shift());
    turno = "jogador";
  } else if (valorJogador < valorComputador) {
    derrotas++;
    resultado = `O computador venceu a rodada com o atributo ${atributoSelecionado}.`;
    baralhoComputador.push(baralhoComputador.shift());
    baralhoComputador.push(baralhoJogador.shift());
    turno = "computador";
  } else {
    empates++;
    resultado = `Empate no atributo ${atributoSelecionado}.`;
    baralhoJogador.push(baralhoJogador.shift());
    baralhoComputador.push(baralhoComputador.shift());
  }

  document.querySelector("#resultado").innerHTML = resultado + `<br>Vitórias: ${vitorias} | Derrotas: ${derrotas} | Empates: ${empates}`;
  esperandoProximaRodada = true;
  document.querySelector("#btn-jogar").textContent = "Próxima Rodada";
}

function prepararRodada() {
  if (baralhoJogador.length === 0) {
    document.querySelector("#resultado").innerHTML += "<br><strong>Você perdeu o jogo!</strong>";
    return;
  }

  if (baralhoComputador.length === 0) {
    document.querySelector("#resultado").innerHTML += "<br><strong>Você venceu o jogo!</strong>";
    return;
  }

  cartaAtual = baralhoJogador[0];
  cartaDoComputador = baralhoComputador[0];
  document.querySelector("#carta-computador").innerHTML = "";

  if (turno === "jogador") {
    document.querySelector("#carta-jogador").innerHTML = gerarHtmlCartaComRadios(cartaAtual);
    document.querySelector("#resultado").innerHTML = "Sua vez. Escolha um atributo.";
  } else {
    let atributo = escolherAtributoAcimaDaMedia(cartaDoComputador, medias);
    document.querySelector("#carta-jogador").innerHTML = gerarHtmlCarta(cartaAtual);
    exibirCartasEDefinirVencedor(atributo);
  }
}

fetch("cartas.json")
  .then(res => res.json())
  .then(baralho => {
    medias = calcularMedias(baralho);
    baralho.sort(() => Math.random() - 0.5);
    const metade = Math.floor(baralho.length / 2);
    baralhoJogador = baralho.slice(0, metade);
    baralhoComputador = baralho.slice(metade);

    prepararRodada();
  });

document.querySelector("#btn-jogar").addEventListener("click", function () {
  if (esperandoProximaRodada) {
    esperandoProximaRodada = false;
    prepararRodada();
    this.textContent = "Jogar";
    return;
  }

  if (turno === "jogador") {
    let inputSelecionado = document.querySelector('input[name="atributo"]:checked');
    if (!inputSelecionado) {
      alert("Escolha um atributo para jogar!");
      return;
    }
    let atributoSelecionado = inputSelecionado.value;
    exibirCartasEDefinirVencedor(atributoSelecionado);
  }
});

document.querySelector("#btn-reiniciar").addEventListener("click", function () {
  fetch("cartas.json")
    .then(res => res.json())
    .then(baralho => {
      medias = calcularMedias(baralho);
      baralho.sort(() => Math.random() - 0.5);
      baralhoJogador = baralho.slice(0, 6);
      baralhoComputador = baralho.slice(6);
      vitorias = 0;
      derrotas = 0;
      empates = 0;
      turno = "jogador";
      esperandoProximaRodada = false;
      document.querySelector("#resultado").innerHTML = "Novo jogo iniciado!";
      document.querySelector("#btn-jogar").textContent = "Jogar";
      prepararRodada();
    });
});

