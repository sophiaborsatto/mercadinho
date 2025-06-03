//catalogo

//assincrono
async function fetchProdutos(){
    try {
                        //aguarde a resposta
        const resposta = await fetch('https://fakestoreapi.com/products');
        const listaProdutos = resposta.json();
        console.log(listaProdutos);
    } catch (error) {
        console.error("Erro na api: ", error);
        divCatalogo.innerHTML = "<h1>Site indisponivel, tente novamente.</h1>";

    }
}
fetchProdutos();