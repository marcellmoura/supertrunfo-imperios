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
  return gerarHtmlCartaBase(carta, true);
}

function gerarHtmlCarta(carta) {
  return gerarHtmlCartaBase(carta, false);
}

function gerarHtmlCartaBase(carta, comRadios = false) {
  let html = `
    <div class="carta-fundo">
      <div class="carta-moldura">
        <div class="carta-cabecalho">
          <h2>${carta.nome}</h2>
        </div>
        <div class="carta-imagem">
        ${carta.imagem ? `<img src="img/${carta.imagem}" alt="${carta.nome}">` : ""}
        </div>
        <div class="carta-atributos">
          <h3>Atributos</h3>
  `;

  for (let atributo in carta.atributos) {
    let valorFormatado = carta.atributos[atributo];

    if (atributo === "populacao") {
      valorFormatado = `${valorFormatado} milhões`;
    }

    if (atributo === "area") {
      valorFormatado = `${valorFormatado.toLocaleString()} km<sup>2</sup>`;
    }

    if (comRadios) {
      html += `
        <div class="linha-atributo atributo-clicavel" data-atributo="${atributo}">
          <span class="atributo-nome">${atributo}:</span>
          <span class="atributo-valor">${valorFormatado}</span>
        </div>`;
    } else {
      html += `
        <div class="linha-atributo">
          <span class="atributo-nome">${atributo}:</span>
          <span class="atributo-valor">${valorFormatado}</span>
        </div>`;
    }
  }

  html += `
        </div>
      </div>
    </div>
  `;
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
    document.querySelector("#btn-jogar").removeAttribute("data-selecionado");
  } else {
    let atributo = escolherAtributoAcimaDaMedia(cartaDoComputador, medias);
    document.querySelector("#carta-jogador").innerHTML = gerarHtmlCarta(cartaAtual);
    exibirCartasEDefinirVencedor(atributo);
  }
}

fetch("data/cartas.json")
  .then(res => res.json())
  .then(baralho => {
    medias = calcularMedias(baralho);
    baralho.sort(() => Math.random() - 0.5);
    const metade = Math.floor(baralho.length / 2);
    baralhoJogador = baralho.slice(0, metade);
    baralhoComputador = baralho.slice(metade);

    prepararRodada();
  });

document.addEventListener("click", function (e) {
  const linha = e.target.closest(".atributo-clicavel");

  if (linha && turno === "jogador" && !esperandoProximaRodada) {
    // Remover seleção anterior
    document.querySelectorAll(".atributo-clicavel").forEach(el => {
      el.classList.remove("selecionado");
    });

    // Marcar a linha clicada
    linha.classList.add("selecionado");

    // Salvar o atributo selecionado no botão Jogar
    const atributo = linha.getAttribute("data-atributo");
    document.querySelector("#btn-jogar").setAttribute("data-selecionado", atributo);
  }
});

document.querySelector("#btn-jogar").addEventListener("click", function () {
  if (esperandoProximaRodada) {
    esperandoProximaRodada = false;
    prepararRodada();
    this.textContent = "Jogar";
    return;
  }

  if (turno === "jogador") {
    let atributoSelecionado = this.getAttribute("data-selecionado");
    if (!atributoSelecionado) {
      alert("Escolha um atributo para jogar!");
      return;
    }
    exibirCartasEDefinirVencedor(atributoSelecionado);
  }
});

document.querySelector("#btn-reiniciar").addEventListener("click", function () {
  fetch("data/cartas.json")
    .then(res => res.json())
    .then(baralho => {
      medias = calcularMedias(baralho);
      baralho.sort(() => Math.random() - 0.5);
      const metade = Math.floor(baralho.length / 2);
      baralhoJogador = baralho.slice(0, metade);
      baralhoComputador = baralho.slice(metade);

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
