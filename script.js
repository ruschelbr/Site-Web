const urlBebidas = 'https://api.jsonbin.io/v3/b/69d64173aaba882197d7779a';
const listaBebidasEl = document.getElementById('listaBebidas');
const visorValorEl = document.getElementById('visorValor');
const infoRefriEl = document.getElementById('infoRefri');
const mensagemEl = document.getElementById('mensagem');
const saidaEl = document.getElementById('saida');
const slotMoedasEl = document.getElementById('slotMoedas');

let bebidas = [];
let bebidaSelecionada = null;
let valorInserido = 0;

function formatar(valor) { 
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); 
}

function atualizarVisor() { 
  visorValorEl.textContent = formatar(valorInserido); 
}

function mostrarMensagem(texto) { 
  mensagemEl.textContent = texto; 
}

function limparSelecao() { 
  document.querySelectorAll('.bebida').forEach(b => b.classList.remove('selecionada')); 
}

function selecionarBebida(indice) {
  bebidaSelecionada = bebidas[indice];
  limparSelecao();
  document.querySelector('.bebida[data-indice="' + indice + '"]').classList.add('selecionada');
  infoRefriEl.textContent = bebidaSelecionada.sabor + ' - ' + formatar(bebidaSelecionada.preco);
  verificarCompra();
}

function liberarBebida(troco) {
  const texto = troco > 0 
    ? 'Bebida ' + bebidaSelecionada.sabor + ' liberada. Troco: ' + formatar(troco) + '.' 
    : 'Bebida ' + bebidaSelecionada.sabor + ' liberada.';
  
  mostrarMensagem(texto);
  saidaEl.innerHTML = '<img src="' + bebidaSelecionada.imagem + '" alt="' + bebidaSelecionada.sabor + '"><span>' + texto + '</span>';
  
  valorInserido = 0;
  atualizarVisor();
  infoRefriEl.textContent = 'Nenhuma bebida selecionada';
  limparSelecao();
  bebidaSelecionada = null;
}

function verificarCompra() {
  if (!bebidaSelecionada) return;
  
  if (valorInserido < bebidaSelecionada.preco) {
    mostrarMensagem('Faltam ' + formatar(bebidaSelecionada.preco - valorInserido) + ' para comprar ' + bebidaSelecionada.sabor + '.');
  } else {
    liberarBebida(Number((valorInserido - bebidaSelecionada.preco).toFixed(2)));
  }
}

function adicionarMoeda(valorTexto) {
  valorInserido = Number((valorInserido + Number(valorTexto)).toFixed(2));
  atualizarVisor();
  verificarCompra();
}

function configurarMoedas() {
  document.querySelectorAll('.moeda').forEach(moeda => {
    moeda.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', moeda.dataset.valor);
      slotMoedasEl.classList.add('ativo');
    });
    moeda.addEventListener('dragend', () => slotMoedasEl.classList.remove('ativo'));
  });
  
  slotMoedasEl.addEventListener('dragover', e => e.preventDefault());
  
  slotMoedasEl.addEventListener('drop', e => {
    e.preventDefault();
    adicionarMoeda(e.dataTransfer.getData('text/plain'));
    slotMoedasEl.classList.remove('ativo');
  });
}

function carregarBebidas() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', urlBebidas, true);
  
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const resposta = JSON.parse(xhr.responseText);
      bebidas = resposta.record.bebidas;
      listaBebidasEl.innerHTML = '';
      
      bebidas.forEach((bebida, indice) => {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'bebida';
        botao.dataset.indice = indice;
        botao.innerHTML = '<img src="' + bebida.imagem + '" alt="' + bebida.sabor + '">' +
                          '<div>' +
                            '<div>' + bebida.sabor + '</div>' +
                            '<div class="preco">' + formatar(bebida.preco) + '</div>' +
                          '</div>';
        botao.addEventListener('click', () => selecionarBebida(indice));
        listaBebidasEl.appendChild(botao);
      });
    }
  };
  xhr.send();
}

document.addEventListener('DOMContentLoaded', () => {
  carregarBebidas();
  configurarMoedas();
  atualizarVisor();
});