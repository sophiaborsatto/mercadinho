const telaLogin = document.getElementById('tela-login');
const aplicativo = document.getElementById('aplicativo');
const listaProdutos = document.getElementById('lista-produtos');
const itensCarrinho = document.getElementById('itens-carrinho');
const totalCarrinho = document.getElementById('total-carrinho');
const telaCheckout = document.getElementById('tela-checkout');

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Verificação se está logado
window.onload = () => {
  const logado = localStorage.getItem("logado");
  if (logado !== "true") {
    window.location.href = "login.html";
  } else {
    telaLogin.style.display = 'none';
    aplicativo.style.display = 'block';
    carregarProdutos();
    atualizarCarrinho();
  }
};

function fazerLogin() {
  const usuario = document.getElementById('campo-usuario').value;
  if (usuario.trim()) {
    localStorage.setItem("logado", "true");
    telaLogin.style.display = 'none';
    aplicativo.style.display = 'block';
    carregarProdutos();
    atualizarCarrinho();
  }
}

function fazerLogout() {
  localStorage.removeItem("logado");
  location.href = "login.html";
}

function carregarProdutos() {
  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(produtos => {
      listaProdutos.innerHTML = '';
      produtos.forEach(produto => {
        const item = document.createElement('div');
        item.className = 'produto';
        item.innerHTML = `
          <img src="${produto.image}" alt="${produto.title}">
          <h3>${produto.title}</h3>
          <p>${produto.description}</p>
          <strong>R$ ${produto.price.toFixed(2)}</strong>
          <button onclick='adicionarAoCarrinho(${produto.id})'>Adicionar</button>
        `;
        listaProdutos.appendChild(item);
      });
      localStorage.setItem('produtosDisponiveis', JSON.stringify(produtos));
    })
    .catch(err => {
      console.error("Erro ao carregar produtos:", err);
      alert("Não foi possível carregar os produtos.");
    });
}

function adicionarAoCarrinho(idProduto) {
  const produtosDisponiveis = JSON.parse(localStorage.getItem('produtosDisponiveis')) || [];

  if (!produtosDisponiveis.length) {
    alert('Produtos ainda não foram carregados. Tente novamente em instantes.');
    return;
  }

  const produtoSelecionado = produtosDisponiveis.find(p => p.id === idProduto);

  if (produtoSelecionado) {
    const jaExiste = carrinho.some(item => item.id === idProduto);
    if (jaExiste) {
      alert('Este produto já está no carrinho!');
    } else {
      carrinho.push(produtoSelecionado);
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      atualizarCarrinho();
    }
  }
}

function atualizarCarrinho() {
  itensCarrinho.innerHTML = '';
  let total = 0;

  carrinho.forEach((item, indice) => {
    total += item.price;
    const li = document.createElement('li');
    li.textContent = `${item.title} - R$ ${item.price.toFixed(2)}`;
    const botaoRemover = document.createElement('button');
    botaoRemover.textContent = 'Remover';
    botaoRemover.onclick = () => {
      carrinho.splice(indice, 1);
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      atualizarCarrinho();
    };
    li.appendChild(botaoRemover);
    itensCarrinho.appendChild(li);
  });

  totalCarrinho.textContent = total.toFixed(2);
}

function abrirCheckout() {
  const resumo = document.getElementById('resumo-compra');
  resumo.innerHTML = '';

  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio.');
    return;
  }

  const ul = document.createElement('ul');
  let total = 0;

  carrinho.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.title} - R$ ${item.price.toFixed(2)}`;
    ul.appendChild(li);
    total += item.price;
  });

  const totalEl = document.createElement('p');
  totalEl.innerHTML = `<strong>Total: R$ ${total.toFixed(2)}</strong>`;

  resumo.appendChild(ul);
  resumo.appendChild(totalEl);

  telaCheckout.style.display = 'block';
}


function confirmarPedido() {
  const metodoPagamento = document.getElementById('metodo-pagamento').value;
  const endereco = document.getElementById('campo-endereco').value;

  if (metodoPagamento && endereco.trim()) {
    alert(`Pedido confirmado!\nMétodo: ${metodoPagamento}\nEntrega: ${endereco}`);
    carrinho = [];
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinho();
    telaCheckout.style.display = 'none';
  } else {
    alert('Preencha todos os dados para finalizar a compra.');
  }
}