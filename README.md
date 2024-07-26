# Projeto de Gerenciamento de Produtos e Categorias

Este projeto é uma aplicação web para gerenciar produtos e categorias. Ele fornece uma interface para criar, listar, editar e excluir produtos e categorias, e associar produtos a categorias específicas.

## Funcionalidades

- **Cadastro de Produtos:** Adicione novos produtos com título, descrição e preço.
- **Listagem de Produtos:** Visualize uma tabela com os produtos cadastrados, incluindo título, preço e categoria. Veja detalhes adicionais sobre cada produto e associe produtos a categorias.
- **Cadastro de Categorias:** Crie novas categorias com título e descrição.
- **Listagem de Categorias:** Veja uma tabela com as categorias cadastradas, incluindo título e descrição. Edite e exclua categorias.
- **Associação de Categorias a Produtos:** Associe produtos a categorias existentes.

## Tecnologias Utilizadas

### Frontend

- **React:** Biblioteca para construir interfaces de usuário.
- **Ant Design (antd):** Biblioteca de componentes UI para React.
- **Axios:** Cliente HTTP para requisições à API.
- **React Router:** Biblioteca para roteamento em React.
- **Jest e React Testing Library:** Ferramentas para testes unitários e de integração.

### Backend

- **Node.js:** Ambiente de execução para o backend.
- **Express:** Framework para construir a API REST.
- **MySQL:** Banco de dados para persistência dos dados.
- **Sequelize:** ORM para interagir com o banco de dados.

## Instalação e Configuração

### Backend

1. **Clone o Repositório do Backend**

   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio-backend.git
   cd seu-repositorio-backend
   ```

2. **Instale as Dependências**

```
npm install
```

3. **Configure o Ambiente**

Crie um arquivo .env na raiz do projeto com as seguintes variáveis de ambiente:

```DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=senha
DB_NAME=nome_do_banco
PORT=8001
```

4. **Inicie o Banco de Dados**

Certifique-se de que o MySQL está rodando e que o banco de dados foi criado. Você pode usar ferramentas como MySQL Workbench ou comandos SQL para configurar o banco.

5. **Rodar Migrações e Seeders**

Para criar as tabelas e popular o banco de dados com dados iniciais, execute:

```
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
````

6. **Inicie o Servidor Backend**

```
npm start
O backend estará disponível em http://localhost:8001.
```

### Frontend
1. **Clone o Repositório do Frontend**

```
git clone https://github.com/seu-usuario/seu-repositorio-frontend.git
cd seu-repositorio-frontend
```

2. **Instale as Dependências**

```
npm install
````

3. **Configure o Ambiente**

Crie um arquivo .env na raiz do projeto com a URL base da API:

```
REACT_APP_API_URL=http://localhost:8001
```

4. **Inicie o Servidor de Desenvolvimento**

```
npm start
````

5. **O frontend estará disponível em http://localhost:3000.**

## Estrutura do Projeto
### Frontend
- src/components/: Contém os componentes React, como Catalog, Product, Categories e Category.
- src/api/: Contém funções para realizar chamadas à API.
- src/App.js: Configuração das rotas e estrutura principal da aplicação.
- src/index.js: Ponto de entrada da aplicação.

### Backend
- src/models/: Contém os modelos do banco de dados definidos com Sequelize.
- src/routes/: Define as rotas da API.
- src/controllers/: Contém a lógica de controle das rotas.
- src/config/: Configurações da aplicação, como a conexão com o banco de dados.
- tests: diretório onde se encontram os testes unitários
