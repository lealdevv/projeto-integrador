# Feira Local

Plataforma web que conecta pequenos produtores locais a compradores, sem intermediários. O produtor cadastra seus produtos e o comprador encontra o que precisa no catálogo e negocia direto pelo WhatsApp.

Projeto Integrador: Boas Práticas de Desenvolvimento de Software.

## Funcionalidades

- Cadastro de produtores (nome, cidade e WhatsApp), com validação
- Cadastro de produtos (nome, preço, categoria, descrição e foto), ligados a um produtor
- Edição e exclusão de produtos e de produtores
- Catálogo público com cartões de produtos
- Pesquisa por nome (ignora acentos e maiúsculas)
- Botão "Chamar no WhatsApp" com mensagem pronta para o produtor

## Tecnologias

- HTML5
- CSS3
- JavaScript (puro, sem bibliotecas)
- LocalStorage do navegador para guardar os dados

## Como executar

1. Baixe ou clone o repositório.
2. Abra a pasta no VS Code.
3. Instale a extensão **Live Server**.
4. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.

Também é possível abrir o `index.html` direto no navegador.

## Estrutura do projeto

```
projeto-integrador/
├── index.html                # catálogo (tela do comprador)
├── cadastro-produtor.html    # cadastro e lista de produtores
├── cadastro-produto.html     # cadastro, edição e exclusão de produtos
├── css/
│   └── style.css             # estilos de todo o sistema
└── js/
    ├── storage.js            # acesso ao LocalStorage
    ├── produtores.js         # lógica de produtores
    ├── produtos.js           # lógica de produtos
    └── catalogo.js           # catálogo, pesquisa e WhatsApp
```

## Observações

- Os dados ficam salvos apenas no navegador de quem usa (LocalStorage). Não há servidor nem banco de dados externo.
- As fotos são redimensionadas antes de salvar, por causa do limite de espaço do LocalStorage.

## Equipe

- Produtor (cadastros): Gabrielli Monteiro de Lima, Ian Gil Barddal, Laio Henrique da Rocha Lima
- Consumidor (catálogo): Abner Luan Carvalho Bonfim, Caio Vinicius dos Santos Silva Costa, Daniel Emanuel de Castilho Santos, João Pedro de Almeida Abreu