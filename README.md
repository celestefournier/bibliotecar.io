# Bibliotecar.io

Bibliotecário é uma API RESTful que tem como função cadastrar e consultar livros, assim como obter outros livros da internet de um site pré-selecionado com Web Scraping.

## Requerimentos

Este projeto requer a instalação do `Node.js`.

## Instalação

- Clone o respositório: `git clone https://github.com/gustavofournier/bibliotecar.io`
- Instale as dependências: `npm install`
- Inicie o servidor: `npm start`
- No arquivo "config/dbconfig.js", é possível alterar o endereço do banco MongoDB.

## Utilização

Inserindo um novo livro:
```
http POST http://localhost:3000/book

--

BODY:

{
"title": "título de exemplo",
"description": "descrição de exemplo",
"isbn": "9789999999999",
"language": "BR"
}
```

Obtendo um livro através do ID
```
http GET http://localhost:3000/books/{id-exemplo}
```

Obtendo livros Kotlin através da internet
```
http GET http://localhost:3000/books
```

## Ferramentas utilizadas
Ferramentas que foram utilizadas para criar e testar o projeto:

- Express
- Mongoose
- Nodemon
- Cheerio
- Request
- Body-parser
- MongoDB
- Postman

## Autor

Esse projeto foi criado por [Gustavo Fournier](https://github.com/gustavofournier).
