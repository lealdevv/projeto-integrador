// js/produtores.js
// Cadastro, listagem e exclusão de produtores

const formProdutor = document.getElementById("form-produtor");
const listaProdutores = document.getElementById("lista-produtores");
const mensagem = document.getElementById("mensagem");

function somenteDigitos(texto) {
  return texto.replace(/\D/g, "");
}

function lerDadosFormulario() {
  return {
    nome: formProdutor.nome.value.trim(),
    cidade: formProdutor.cidade.value.trim(),
    whatsapp: somenteDigitos(formProdutor.whatsapp.value),
  };
}

function validarProdutor(dados) {
  const erros = {};

  if (dados.nome.length < 3) {
    erros.nome = "Informe o nome com pelo menos 3 letras.";
  }
  if (dados.cidade.length < 2) {
    erros.cidade = "Informe a cidade.";
  }
  if (![10, 11].includes(dados.whatsapp.length)) {
    erros.whatsapp = "Informe o DDD + número (10 ou 11 dígitos).";
  }

  return erros;
}

function mostrarErros(erros) {
  formProdutor.querySelectorAll("[data-erro]").forEach((span) => {
    const campo = span.dataset.erro;
    span.textContent = erros[campo] || "";
    span.parentElement.classList.toggle("invalido", Boolean(erros[campo]));
  });
}

function formatarWhatsapp(numero) {
  const ddd = numero.slice(0, 2);
  const resto = numero.slice(2);
  const divisao = resto.length === 9 ? 5 : 4;
  return `(${ddd}) ${resto.slice(0, divisao)}-${resto.slice(divisao)}`;
}

function renderizarProdutores() {
  const produtores = lerLista(CHAVES.produtores);
  listaProdutores.innerHTML = "";

  if (produtores.length === 0) {
    const vazio = document.createElement("li");
    vazio.className = "vazio";
    vazio.textContent = "Nenhum produtor cadastrado ainda.";
    listaProdutores.appendChild(vazio);
    return;
  }

  produtores.forEach((produtor) => {
    const item = document.createElement("li");

    const info = document.createElement("span");
    info.textContent = `${produtor.nome} - ${produtor.cidade} - ${formatarWhatsapp(produtor.whatsapp)}`;

    const botaoExcluir = document.createElement("button");
    botaoExcluir.type = "button";
    botaoExcluir.className = "botao botao-perigo";
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.addEventListener("click", () => excluirProdutor(produtor.id));

    item.append(info, botaoExcluir);
    listaProdutores.appendChild(item);
  });
}

function excluirProdutor(id) {
  if (!confirm("Excluir este produtor e todos os produtos dele?")) {
    return;
  }

  // Remove também os produtos do produtor, para não deixar dados órfãos
  const produtosRestantes = lerLista(CHAVES.produtos).filter(
    (produto) => produto.produtorId !== id
  );
  salvarLista(CHAVES.produtos, produtosRestantes);

  removerItem(CHAVES.produtores, id);
  renderizarProdutores();
}

formProdutor.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const dados = lerDadosFormulario();
  const erros = validarProdutor(dados);
  mostrarErros(erros);

  if (Object.keys(erros).length > 0) {
    mensagem.textContent = "";
    return;
  }

  adicionarItem(CHAVES.produtores, dados);
  formProdutor.reset();
  mensagem.textContent = "Produtor cadastrado com sucesso!";
  renderizarProdutores();
});

renderizarProdutores();