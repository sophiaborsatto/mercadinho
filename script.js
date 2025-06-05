//catalogo
const div =  document.getElementById('catalogo');
//assincrono
async function fetchProdutos(){
    try {
                        //aguarde a resposta / espere
        const resposta = await fetch('https://fakestoreapi.com/products');
        const listaProdutos = await resposta.json();
        console.log(listaProdutos);
        imprimirVetor(listaProdutos);
    } catch (error) {
        console.error("Erro na api: ", error);
        //para fazer um aviso de erro:
        let h1 = document.createElement('h1');
        h1.textContent = 'Indisponivel. Tente novamente mais tarde.';
        div.appendChild(h1);
        //ou:
        //divCatalogo.innerHTML = "<h1>Site indisponivel, tente novamente.</h1>";
    }
}
function imprimirVetor(vetor) {
    div.innerHTML = "";

    vetor.forEach(element => {
        const divProduto = document.createElement('div');
        divProduto.className = "itemProduto";

        divProduto.innerHTML = `
            <img src="${element.image}" alt="produto">
            <h2>${element.title}</h2>
            <button onclick="comprar()">Comprar</button>
        `;      //para chamar um elemento
        div.appendChild(divProduto);
    });
}
fetchProdutos();
