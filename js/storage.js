// js/storage.js
// Camada de acesso aos dados (LocalStorage)

const CHAVES = {
  produtores: "produtores",
  produtos: "produtos",
};

function lerLista(chave) {
  try {
    return JSON.parse(localStorage.getItem(chave)) || [];
  } catch (erro) {
    console.error("Erro ao ler dados de", chave, erro);
    return [];
  }
}

function salvarLista(chave, lista) {
  localStorage.setItem(chave, JSON.stringify(lista));
}

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function adicionarItem(chave, item) {
  const lista = lerLista(chave);
  const novoItem = { id: gerarId(), ...item };
  lista.push(novoItem);
  salvarLista(chave, lista);
  return novoItem;
}

function atualizarItem(chave, id, novosDados) {
  const lista = lerLista(chave).map((item) =>
    item.id === id ? { ...item, ...novosDados } : item
  );
  salvarLista(chave, lista);
}

function removerItem(chave, id) {
  const lista = lerLista(chave).filter((item) => item.id !== id);
  salvarLista(chave, lista);
}