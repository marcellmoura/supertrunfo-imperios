let baralhoJogador;
let baralhoComputador;
let cartaAtual;

fetch("cartas.json")
  .then(function (resposta) {
    return resposta.json();
  })
  .then(function (baralho) {
    baralho.sort(() => Math.random() - 0.5)
    baralhoJogador = baralho.slice(0, 6)
    baralhoComputador = baralho.slice(6)
    console.log("Baralho do jogador:", baralhoJogador);
    console.log("Baralho do computador:", baralhoComputador);
    cartaAtual = baralhoJogador[0];
    let html = `<h2>${cartaAtual.nome}</h2>`
    let atributos = cartaAtual.atributos;
    html += `<input type="radio" name="atributo" value="area"> Área: ${atributos.area}<br>`;
    html += `<input type="radio" name="atributo" value="cultura"> Cultura: ${atributos.cultura}<br>`;
    html += `<input type="radio" name="atributo" value="forca"> Força: ${atributos.forca}<br>`;
    html += `<input type="radio" name="atributo" value="longevidade"> Longevidade: ${atributos.longevidade}<br>`;
    html += `<input type="radio" name="atributo" value="populacao"> População: ${atributos.populacao}<br>`;
    html += `<input type="radio" name="atributo" value="tecnologia"> Tecnologia: ${atributos.tecnologia}<br>`;
    document.querySelector("#carta-jogador").innerHTML = html
  });

document.querySelector("#btn-jogar").addEventListener("click", function () {
  let atributoSelecionado = document.querySelector('input[name="atributo"]:checked').value;
  let valorJogador = cartaAtual.atributos[atributoSelecionado];
  let cartaComputador = baralhoComputador[0];
  let valorComputador = cartaComputador.atributos[atributoSelecionado];
  let resultado = "";

  if (valorJogador > valorComputador) {
    resultado = "Você venceu!";
  } else if (valorJogador < valorComputador) {
    resultado = "Você perdeu!"
  } else {
    resultado = "Empate!";
  }

  document.querySelector("#resultado").innerHTML = resultado;

  let htmlComputador = `<h2>${cartaComputador.nome}</h2>`;
  let atributosComputador = cartaComputador.atributos;
  htmlComputador += `<p>Área: ${atributosComputador.area}</p>`;
  htmlComputador += `<p>Cultura: ${atributosComputador.cultura}</p>`;
  htmlComputador += `<p>Força: ${atributosComputador.forca}</p>`;
  htmlComputador += `<p>Longevidade: ${atributosComputador.longevidade}</p>`;
  htmlComputador += `<p>População: ${atributosComputador.populacao}</p>`;
  htmlComputador += `<p>Tecnologia: ${atributosComputador.tecnologia}</p>`;

  document.querySelector("#carta-computador").innerHTML = htmlComputador;

  baralhoJogador.shift();
  baralhoComputador.shift();

  if (baralhoJogador.length > 0) {
    cartaAtual = baralhoJogador[0];

    let html = `<h2>${cartaAtual.nome}</h2>`;
    let atributos = cartaAtual.atributos;
    html += `<input type="radio" name="atributo" value="area"> Área: ${atributos.area}<br>`;
    html += `<input type="radio" name="atributo" value="cultura"> Cultura: ${atributos.cultura}<br>`;
    html += `<input type="radio" name="atributo" value="forca"> Força: ${atributos.forca}<br>`;
    html += `<input type="radio" name="atributo" value="longevidade"> Longevidade: ${atributos.longevidade}<br>`;
    html += `<input type="radio" name="atributo" value="populacao"> População: ${atributos.populacao}<br>`;
    html += `<input type="radio" name="atributo" value="tecnologia"> Tecnologia: ${atributos.tecnologia}<br>`;
    document.querySelector("#carta-jogador").innerHTML = html;
  } else {
    document.querySelector("#carta-jogador").innerHTML = "";
    document.querySelector("#carta-computador").innerHTML = "";
    document.querySelector("#resultado").innerHTML = "Fim do jogo!";
  }


  console.log("Atributo escolhido:", atributoSelecionado);
});