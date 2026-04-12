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
  document.querySelectorAll('.bebida.selecionada').forEach(btn => btn.classList.remove('selecionada'));
}

function selecionarBebida(indice) {
  bebidaSelecionada = bebidas[indice];
  limparSelecao();
  const btn = document.querySelector('.bebida[data-indice="' + indice + '"]');
  if (btn) btn.classList.add('selecionada');
  infoRefriEl.textContent = bebidaSelecionada.sabor + ' - ' + formatar(bebidaSelecionada.preco);
  mostrarMensagem('Insira moedas até atingir o valor da bebida.');
  verificarCompra();
}

function liberarRefrigerante(troco) {
  const texto = troco > 0
    ? 'Bebida ' + bebidaSelecionada.sabor + ' liberado. Troco: ' + formatar(troco) + '.'
    : 'Bebida ' + bebidaSelecionada.sabor + ' liberado.';
  
  mostrarMensagem("");
  saidaEl.innerHTML = '';
  
  const img = document.createElement('img');
  img.src = bebidaSelecionada.imagem;
  img.alt = bebidaSelecionada.sabor;
  img.loading = 'lazy';
  
  const span = document.createElement('span');
  span.textContent = texto;
  
  saidaEl.appendChild(img);
  saidaEl.appendChild(span);
  
  valorInserido = 0;
  atualizarVisor();
  infoRefriEl.textContent = 'Nenhuma bebida selecionada';
  limparSelecao();
  bebidaSelecionada = null;
}

function verificarCompra() {
  if (!bebidaSelecionada) return;
  if (valorInserido < bebidaSelecionada.preco) {
    const falta = bebidaSelecionada.preco - valorInserido;
    mostrarMensagem('Faltam ' + formatar(falta) + ' para comprar ' + bebidaSelecionada.sabor + '.');
  } else {
    const troco = valorInserido - bebidaSelecionada.preco;
    liberarRefrigerante(troco);
  }
}

function adicionarMoeda(valorTexto) {
  const valor = Number(valorTexto);
  if (Number.isNaN(valor)) return;
  
  valorInserido = Number((valorInserido + valor).toFixed(2));
  atualizarVisor();
  
  if (!bebidaSelecionada) {
    mostrarMensagem('Selecione uma bebida.');
    return;
  }
  verificarCompra();
}

function configurarMoedas() {
  const moedas = document.querySelectorAll('.moeda');
  moedas.forEach(moeda => {
    moeda.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', moeda.dataset.valor);
      slotMoedasEl.classList.add('ativo');
    });
    moeda.addEventListener('dragend', () => {
      slotMoedasEl.classList.remove('ativo');
    });
  });
  
  slotMoedasEl.addEventListener('dragover', e => {
    e.preventDefault();
  });
  
  slotMoedasEl.addEventListener('drop', e => {
    e.preventDefault();
    const valor = e.dataTransfer.getData('text/plain');
    slotMoedasEl.classList.remove('ativo');
    adicionarMoeda(valor);
  });
}

function criarBotoesBebidas() {
  listaBebidasEl.innerHTML = '';
  bebidas.forEach((bebida, indice) => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'bebida';
    botao.dataset.indice = indice;
    
    const img = document.createElement('img');
    img.src = bebida.imagem;
    img.alt = bebida.sabor;
    img.loading = 'lazy';
    
    const caixa = document.createElement('div');
    const nome = document.createElement('div');
    nome.className = 'bebida-nome';
    nome.textContent = bebida.sabor;
    
    const preco = document.createElement('div');
    preco.className = 'bebida-preco';
    preco.textContent = formatar(bebida.preco);
    
    caixa.appendChild(nome);
    caixa.appendChild(preco);
    botao.appendChild(img);
    botao.appendChild(caixa);
    
    botao.addEventListener('click', () => selecionarBebida(indice));
    listaBebidasEl.appendChild(botao);
  });
}

function carregarBebidas() {
  fetch(urlBebidas)
    .then(res => res.json())
    .then(dados => {
      if (dados.record && dados.record.bebidas) {
        bebidas = dados.record.bebidas;
      } else {
        bebidas = [];
      }

      criarBotoesBebidas();
      console.log('bebidas carregadas', bebidas);
      mostrarMensagem('Escolha uma bebida e arraste as moedas.');
    })
    .catch(err => {
      console.log(err);
      mostrarMensagem('Erro ao acessar o serviço de bebidas.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
  carregarBebidas();
  configurarMoedas();
  atualizarVisor();
  saidaEl.addEventListener('click', () => {
    saidaEl.innerHTML = '<span>Nenhuma bebida liberada.</span>';
  });
});