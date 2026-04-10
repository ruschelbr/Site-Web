const urlBebidas = 'https://api.jsonbin.io/v3/b/69d64173aaba882197d7779a';
const listaBebidasEl = document.getElementById('listaBebidas');
const visorValorEl = document.getElementById('visorValor');
const slotMoedasEl = document.getElementById('slotMoedas');

let valorInserido = 0;

function formatar(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function atualizarVisor() {
  visorValorEl.textContent = formatar(valorInserido);
}

function adicionarMoeda(valorTexto) {
  valorInserido = Number((valorInserido + Number(valorTexto)).toFixed(2));
  atualizarVisor();
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
      listaBebidasEl.innerHTML = '';
      
      resposta.record.bebidas.forEach(bebida => {
        const div = document.createElement('div');
        div.className = 'bebida';
        div.innerHTML = '<img src="' + bebida.imagem + '" alt="' + bebida.sabor + '">' +
                        '<div>' +
                          '<div>' + bebida.sabor + '</div>' +
                          '<div class="preco">' + formatar(bebida.preco) + '</div>' +
                        '</div>';
        listaBebidasEl.appendChild(div);
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