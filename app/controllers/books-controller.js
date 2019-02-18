'use strict';

/*
 * POST /book
 */
exports.addBook = function(req, res) {
  var mongoose = require('mongoose');
  var dbconfig = require('../../config/dbconfig.js');
  
  mongoose.Promise = global.Promise;
  mongoose.connect(dbconfig.host, { useNewUrlParser: true });  // Connect to MongoDB
  
  if (typeof req.body != 'object') {
    var bookReq = JSON.parse(req.body);
  } else {
    var bookReq = req.body;
  }

  const BookModel = mongoose.model('books', { title: String, description: String, isbn: String, language: String });
  const book = new BookModel({
    title: bookReq.title,
    description: bookReq.description,
    isbn: bookReq.isbn,
    language: bookReq.language
  });

  book.save(function (error, response) {
      if (!error) {
        res.send("Sucesso!");
      } 
  });
};


/*
 * GET /books/:id
 */
exports.getBook = function(req, res) {
  // var mongoose = require('mongoose');
  // var dbconfig = require('../config/dbconfig.js');
  
  // mongoose.Promise = global.Promise;
  // mongoose.connect(dbconfig.host, { useNewUrlParser: true });
};

/*
 * GET /books
 */
exports.addBooks = function(req, res) {
  var request = require('request');
  var cheerio = require('cheerio');

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
          obj.isbn = regexIsbn.exec(body) || "Undefined";

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
};