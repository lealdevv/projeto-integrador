// js/produtos.js
// Cadastro, listagem, edição e exclusão de produtos

const formProduto = document.getElementById("form-produto");
const selectProdutor = document.getElementById("produtorId");
const listaProdutos = document.getElementById("lista-produtos");
const mensagem = document.getElementById("mensagem");
const botaoEnviar = document.getElementById("botao-enviar");
const botaoCancelar = document.getElementById("botao-cancelar");
const previaFoto = document.getElementById("previa-foto");
const tituloFormulario = document.getElementById("titulo-formulario");

const TAMANHO_MAXIMO_FOTO = 400; // pixels (maior lado)
let fotoAtual = ""; // foto em base64 do produto que está no formulário

// ---------- Produtores no select ----------

function preencherProdutores() {
  const produtores = lerLista(CHAVES.produtores);
  selectProdutor.innerHTML = '<option value="">Selecione o produtor</option>';

  produtores.forEach((produtor) => {
    const opcao = document.createElement("option");
    opcao.value = produtor.id;
    opcao.textContent = `${produtor.nome} - ${produtor.cidade}`;
    selectProdutor.appendChild(opcao);
  });

  if (produtores.length === 0) {
    exibirErros({ produtorId: "Cadastre um produtor antes de cadastrar produtos." });
  }
}

// ---------- Leitura e validação ----------

function converterPreco(texto) {
  return Number(texto.trim().replace(",", "."));
}

function lerDadosProduto() {
  return {
    produtorId: formProduto.produtorId.value,
    nome: formProduto.nome.value.trim(),
    preco: converterPreco(formProduto.preco.value),
    categoria: formProduto.categoria.value,
    descricao: formProduto.descricao.value.trim(),
    foto: fotoAtual,
  };
}

function validarProduto(dados) {
  const erros = {};

  if (!dados.produtorId) {
    erros.produtorId = "Selecione o produtor responsável.";
  }
  if (dados.nome.length < 2) {
    erros.nome = "Informe o nome do produto.";
  }
  if (!(dados.preco > 0)) {
    erros.preco = "Informe um preço maior que zero (ex: 4,50).";
  }
  if (!dados.categoria) {
    erros.categoria = "Selecione uma categoria.";
  }

  return erros;
}

function exibirErros(erros) {
  formProduto.querySelectorAll("[data-erro]").forEach((span) => {
    const campo = span.dataset.erro;
    span.textContent = erros[campo] || "";
    span.parentElement.classList.toggle("invalido", Boolean(erros[campo]));
  });
}

// ---------- Foto ----------

function redimensionarImagem(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();

    leitor.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    leitor.onload = () => {
      const imagem = new Image();

      imagem.onerror = () => reject(new Error("Arquivo de imagem inválido."));
      imagem.onload = () => {
        const escala = Math.min(
          1,
          TAMANHO_MAXIMO_FOTO / Math.max(imagem.width, imagem.height)
        );
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(imagem.width * escala);
        canvas.height = Math.round(imagem.height * escala);
        canvas.getContext("2d").drawImage(imagem, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };

      imagem.src = leitor.result;
    };

    leitor.readAsDataURL(arquivo);
  });
}

function exibirPrevia() {
  previaFoto.innerHTML = "";
  if (!fotoAtual) {
    return;
  }
  const imagem = document.createElement("img");
  imagem.src = fotoAtual;
  imagem.alt = "Prévia da foto do produto";
  imagem.className = "miniatura";
  previaFoto.appendChild(imagem);
}

formProduto.foto.addEventListener("change", async () => {
  const arquivo = formProduto.foto.files[0];
  if (!arquivo) {
    return;
  }

  if (!arquivo.type.startsWith("image/")) {
    exibirErros({ foto: "Escolha um arquivo de imagem." });
    formProduto.foto.value = "";
    return;
  }

  try {
    fotoAtual = await redimensionarImagem(arquivo);
    exibirErros({});
    exibirPrevia();
  } catch (erro) {
    exibirErros({ foto: erro.message });
  }
});

// ---------- Formulário ----------

function limparFormulario() {
  formProduto.reset();
  formProduto.produtoId.value = "";
  fotoAtual = "";
  exibirPrevia();
  exibirErros({});
  tituloFormulario.textContent = "Cadastro de produto";
  botaoEnviar.textContent = "Cadastrar produto";
  botaoCancelar.hidden = true;
}

function iniciarEdicao(produto) {
  formProduto.produtoId.value = produto.id;
  formProduto.produtorId.value = produto.produtorId;
  formProduto.nome.value = produto.nome;
  formProduto.preco.value = String(produto.preco).replace(".", ",");
  formProduto.categoria.value = produto.categoria;
  formProduto.descricao.value = produto.descricao;
  fotoAtual = produto.foto || "";
  exibirPrevia();
  exibirErros({});
  mensagem.textContent = "";

  tituloFormulario.textContent = "Editar produto";
  botaoEnviar.textContent = "Salvar alterações";
  botaoCancelar.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

botaoCancelar.addEventListener("click", () => {
  limparFormulario();
  mensagem.textContent = "";
});

formProduto.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const dados = lerDadosProduto();
  const erros = validarProduto(dados);
  exibirErros(erros);

  if (Object.keys(erros).length > 0) {
    mensagem.textContent = "";
    return;
  }

  try {
    const idEdicao = formProduto.produtoId.value;

    if (idEdicao) {
      atualizarItem(CHAVES.produtos, idEdicao, dados);
      mensagem.textContent = "Produto atualizado com sucesso!";
    } else {
      adicionarItem(CHAVES.produtos, dados);
      mensagem.textContent = "Produto cadastrado com sucesso!";
    }
  } catch (erro) {
    // Acontece, por exemplo, se o LocalStorage estiver cheio
    console.error("Erro ao salvar produto:", erro);
    mensagem.textContent = "Não foi possível salvar. Tente uma foto menor.";
    return;
  }

  limparFormulario();
  renderizarProdutos();
});

// ---------- Listagem ----------

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function buscarNomeProdutor(produtorId) {
  const produtor = lerLista(CHAVES.produtores).find((p) => p.id === produtorId);
  return produtor ? produtor.nome : "Produtor não encontrado";
}

function excluirProduto(id) {
  if (!confirm("Excluir este produto?")) {
    return;
  }

  // Se o produto excluído estava aberto para edição, volta o formulário ao normal
  if (formProduto.produtoId.value === id) {
    limparFormulario();
  }

  removerItem(CHAVES.produtos, id);
  renderizarProdutos();
  mensagem.textContent = "Produto excluído com sucesso!";
}

function renderizarProdutos() {
  const produtos = lerLista(CHAVES.produtos);
  listaProdutos.innerHTML = "";

  if (produtos.length === 0) {
    const vazio = document.createElement("li");
    vazio.className = "vazio";
    vazio.textContent = "Nenhum produto cadastrado ainda.";
    listaProdutos.appendChild(vazio);
    return;
  }

  produtos.forEach((produto) => {
    const item = document.createElement("li");

    const info = document.createElement("div");
    info.className = "produto-info";

    if (produto.foto) {
      const miniatura = document.createElement("img");
      miniatura.src = produto.foto;
      miniatura.alt = `Foto de ${produto.nome}`;
      miniatura.className = "miniatura";
      info.appendChild(miniatura);
    }

    const texto = document.createElement("span");
    texto.textContent = `${produto.nome} - ${formatarPreco(produto.preco)} - ${produto.categoria} (${buscarNomeProdutor(produto.produtorId)})`;
    info.appendChild(texto);

    const acoes = document.createElement("div");
    acoes.className = "acoes";

    const botaoEditar = document.createElement("button");
    botaoEditar.type = "button";
    botaoEditar.className = "botao botao-secundario";
    botaoEditar.textContent = "Editar";
    botaoEditar.addEventListener("click", () => iniciarEdicao(produto));

    const botaoExcluir = document.createElement("button");
    botaoExcluir.type = "button";
    botaoExcluir.className = "botao botao-perigo";
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.addEventListener("click", () => excluirProduto(produto.id));

    acoes.append(botaoEditar, botaoExcluir);
    item.append(info, acoes);
    listaProdutos.appendChild(item);
  });
}

// ---------- Início ----------

preencherProdutores();
renderizarProdutos();