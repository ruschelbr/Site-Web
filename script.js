const urlBebidas = 'https://api.jsonbin.io/v3/b/69d64173aaba882197d7779a';
const listaBebidasEl = document.getElementById('listaBebidas');
const mensagemEl = document.getElementById('mensagem');

function formatar(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function carregarBebidas() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', urlBebidas, true);
  
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const resposta = JSON.parse(xhr.responseText);
        const bebidas = resposta.record.bebidas;
        
        listaBebidasEl.innerHTML = '';
        
        bebidas.forEach(bebida => {
          const div = document.createElement('div');
          div.className = 'bebida';
          div.innerHTML = '<img src="' + bebida.imagem + '" alt="' + bebida.sabor + '">' +
                          '<div>' +
                            '<div>' + bebida.sabor + '</div>' +
                            '<div class="preco">' + formatar(bebida.preco) + '</div>' +
                          '</div>';
          listaBebidasEl.appendChild(div);
        });
        
        mensagemEl.textContent = 'Bebidas carregadas com sucesso.';
      }
    }
  };
  
  xhr.send();
}

document.addEventListener('DOMContentLoaded', carregarBebidas);