# **API de Gestão de Inventário para E-commerce**

## Visão geral
Este projeto é uma API RESTful desenvolvida em Node.js com Express, projetada para gerenciar as operações básicas de um sistema de e-commerce. Ela inclui funcionalidades para autenticação de usuários, gerenciamento de produtos, controle de usuários e processamento de pedidos. A API utiliza um sistema de autenticação baseado em JSON Web Tokens (JWT) e diferencia as permissões de acesso entre usuários comuns (customer) e administradores (manager). Para persistência de dados, o projeto utiliza um banco de dados simples baseado em arquivo JSON, o que o torna ideal para prototipagem e desenvolvimento rápido sem a necessidade de um serviço de banco de dados externo.

## Tecnologias Utilizadas:
- *Node.js*: Ambiente de execução para o JavaScript no servidor.
- *Express.js*: Framework web para a construção da API.
- *jsonwebtoken*: Para gerar e verificar tokens de acesso (JWT).
- *bcryptjs*: Para criptografar as senhas dos usuários.
- *express-validator*: Para validação e sanitização dos dados de entrada nas rotas.
- *dotenv*: Para gerenciar variáveis de ambiente.
- *short-uuid*: Para gerar IDs únicos para os registros.
- *lowdb*: Para armazenamento dos dados no arquivo JSON.

## Funcionalidades Principais
A API está estruturada em torno de quatro recursos principais:

### 1. Autenticação (/api/register, /api/login)
- Registro de Usuários: Qualquer pessoa pode se registrar, recebendo o papel de customer por padrão.
- Login: Usuários registrados podem se autenticar para receber um token JWT, que deve ser usado para acessar as rotas protegidas.

### 2. Usuários (/api/users)
- Gerenciamento completo (CRUD): Apenas usuários com o papel de manager podem criar, listar, visualizar, atualizar e deletar outros usuários.
- Segurança: As senhas são armazenadas de forma segura (hashed) e nunca são expostas nas respostas da API.

### 3. Produtos (/api/products)
- Listagem e Visualização: Qualquer usuário autenticado (seja customer ou manager) pode listar todos os produtos ou visualizar um produto específico pelo seu ID.
- Gerenciamento: Apenas usuários manager podem criar, atualizar e deletar produtos do inventário.

### 4. Pedidos (/api/orders)
- Criação de Pedidos: Apenas usuários customer podem criar novos pedidos. A API valida automaticamente se os produtos solicitados existem e se há estoque suficiente.
- Visualização de Pedidos:
  - customer: Pode visualizar apenas os seus próprios pedidos.
  - manager: Pode visualizar todos os pedidos feitos no sistema.
- Atualização de Status: Apenas usuários manager podem atualizar o status de um pedido (ex: de pending para shipped).

## Como começar
Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou Yarn

### Passos para Instalação
1. Clone o repositório:

```
git clone <URL_DO_SEU_REPOSITORIO>
cd <NOME_DA_PASTA_DO_PROJETO>
```

2. Instale as dependências:
`npm install`
ou
`yarn install`

3. Configure as variáveis de ambiente: Crie um arquivo chamado .env na raiz do projeto e adicione as seguintes variáveis:
```
### Porta em que o servidor irá rodar
PORT=3000

### Chave secreta para gerar os tokens JWT (use uma string longa e segura)
JWT_SECRET=sua_chave_secreta_super_segura
```

4. Inicie o servidor:
`npm start`
ou
`node server.js`

O servidor estará rodando em http://localhost:3000.

## Primeiro Uso

Após iniciar o servidor, você pode interagir com a API usando uma ferramenta como Postman, Insomnia ou curl.

### 1. Registre um usuário manager:
Como o registro padrão cria um customer, você pode editar o arquivo db.json (que será criado na primeira execução) e alterar o role de um usuário para manager para poder acessar as rotas de administração.

### 2. Registre um novo usuário (customer):
- POST /api/register
- Body (JSON):

```json
{
    "name": "João Cliente",
    "email": "joao@cliente.com",
    "password": "senha_segura_123"
}
```

### 3. Faça o login:
- POST /api/login
- Body (JSON):

```json
{
    "email": "joao@cliente.com",
    "password": "senha_segura_123"
}
```

- A resposta incluirá um token. Copie este token.

### 4. Acesse uma rota protegida:
Para acessar rotas como /api/products, inclua o token no cabeçalho da requisição:
- Header: *Authorization*
- Value: *Bearer <SEU_TOKEN_JWT>*

**Agora você está pronto para explorar todas as funcionalidades da API!**

### Projetos futuros:
Este projeto foi desenvolvido com lowdb, o que torna o banco de dados do projeto um ponto de melhoria.
Dessa forma, em breve planejo publicar outra API em Nodejs com o uso de um banco de dados mais elaborado, assim como outros projetos que tenho em mente.

Desenvolvi essa API em Nodejs para a matéria de *Desenvolvimento Web Backend* da *Escola de Ciências e Tecnologia* da *UFRN*, do curso de **Bacharelado em Ciências e Tecnologia**.
- Lucas Orleans
