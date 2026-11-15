// js/catalogo.js
// Catálogo público: listagem, pesquisa e contato via WhatsApp

const campoBusca = document.getElementById("busca");
const gradeProdutos = document.getElementById("grade-produtos");
const contador = document.getElementById("contador");

const CODIGO_PAIS = "55"; // Brasil

// Remove acentos e deixa minúsculo, para a pesquisa ser mais flexível
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function montarLinkWhatsapp(produtor, produto) {
  const mensagem = `Olá, ${produtor.nome}! Vi o produto "${produto.nome}" na Feira Local e tenho interesse.`;
  return `https://wa.me/${CODIGO_PAIS}${produtor.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) {
    elemento.className = classe;
  }
  if (texto) {
    elemento.textContent = texto;
  }
  return elemento;
}

function criarCartao(produto, produtor) {
  const cartao = criarElemento("article", "cartao-produto");

  if (produto.foto) {
    const imagem = document.createElement("img");
    imagem.src = produto.foto;
    imagem.alt = `Foto de ${produto.nome}`;
    cartao.appendChild(imagem);
  } else {
    cartao.appendChild(criarElemento("div", "sem-foto", "Sem foto"));
  }

  const corpo = criarElemento("div", "cartao-corpo");
  corpo.appendChild(criarElemento("h3", "", produto.nome));
  corpo.appendChild(criarElemento("span", "etiqueta", produto.categoria));
  corpo.appendChild(criarElemento("span", "preco", formatarPreco(produto.preco)));

  if (produto.descricao) {
    corpo.appendChild(criarElemento("p", "", produto.descricao));
  }

  corpo.appendChild(
    criarElemento("span", "produtor", `${produtor.nome} - ${produtor.cidade}`)
  );

  const botao = criarElemento("a", "botao-whatsapp", "Chamar no WhatsApp");
  botao.href = montarLinkWhatsapp(produtor, produto);
  botao.target = "_blank";
  botao.rel = "noopener noreferrer";
  corpo.appendChild(botao);

  cartao.appendChild(corpo);
  return cartao;
}

function renderizarCatalogo() {
  const termo = normalizar(campoBusca.value.trim());
  const produtores = lerLista(CHAVES.produtores);
  const todosProdutos = lerLista(CHAVES.produtos);

  const filtrados = todosProdutos.filter((produto) =>
    normalizar(produto.nome).includes(termo)
  );

  gradeProdutos.innerHTML = "";

  if (todosProdutos.length === 0) {
    contador.textContent = "Nenhum produto cadastrado ainda.";
    return;
  }

  contador.textContent =
    filtrados.length === 0
      ? "Nenhum produto encontrado para essa pesquisa."
      : `${filtrados.length} produto(s) encontrado(s).`;

  filtrados.forEach((produto) => {
    const produtor = produtores.find((p) => p.id === produto.produtorId);
    if (produtor) {
      gradeProdutos.appendChild(criarCartao(produto, produtor));
    }
  });
}

campoBusca.addEventListener("input", renderizarCatalogo);

renderizarCatalogo();