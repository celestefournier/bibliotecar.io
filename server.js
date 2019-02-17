var express = require('express');
var app = express();
var cheerio = require('cheerio');
var request = require('request');
// var rp = require('request-promise');

// Consultar todos os livros
app.get('/books', function (req, res) {
  request('http://kotlinlang.org/docs/books.html', function (error, response, body) {
    const $ = cheerio.load(body);
    const length = $('.page-content.g-9 h2').length;
    var books = [];
    var links = 0;

    // Obter as informações de cada livro
    $('.page-content.g-9 h2').each(function(i) {
      let obj = {};
      let book = $(this).nextUntil('h2');

      obj.title = $(this).text();
      obj.description = book.filter('p').text().replace(/\s\s+/g, ' ');
      obj.isbn = "Undefined";
      obj.lang = book.filter('.book-lang').text().toUpperCase();

      let options = {
        url: book.find('a').attr('href')
      }

      request(options, function (error,response,body) {
        if (!error && response.statusCode == 200) {

          let regexIsbn = /\b(97(8|9))?[0-9]{9}([0-9]|X)\b/;

          obj.isbn = regexIsbn.exec(body)[0] || "Undefined";

          links++;

          if (links+1 >= length) {
            books.push(obj);
            res.header("Content-Type",'application/json');
            res.send(JSON.stringify({
              numberBooks: length,
              books: books
            }, null, 4));
          }
        }
      });

      books.push(obj);
    });
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});