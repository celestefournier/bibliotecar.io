'use strict';
var mongoose = require('mongoose');
var dbconfig = require('../../config/dbconfig.js');
var model = require("../models/books-model");
var bookModel = mongoose.model('book');

/*
 * POST /book
 */
exports.addBook = function(req, res) {
  
  // Connect to MongoDB
  mongoose.Promise = global.Promise;
  mongoose.connect(dbconfig.host, { useNewUrlParser: true });
  
  // Parse JSON if is not object
  try {
    if (typeof req.body != 'object') {
      var bookReq = JSON.parse(req.body.replace(/\t/g, ''));    // Remove tab if exist
    } else {
      var bookReq = req.body;
    }
  } catch (err) {
    res.json({ status: "error", message: "Please, insert a valid format." });
  }

  // Handle error required fields
  if (typeof bookReq.title == 'undefined')
    res.json({ status: "error", message: "Title required." });
  if (typeof bookReq.description == 'undefined')
    res.json({ status: "error", message: "Description required." });
  if (typeof bookReq.isbn == 'undefined')
    res.json({ status: "error", message: "ISBN required." });
  if (typeof bookReq.language == 'undefined')
    res.json({ status: "error", message: "language required." });


  // Prepare the query with the user response
  var book = bookModel({
    title: bookReq.title,
    description: bookReq.description,
    isbn: bookReq.isbn,
    language: bookReq.language
  });

  // Try to insert a model
  book.save(function (err, doc) {
      if (!err) {
        res.json({ status: "success", message: "User saved successfully with ID: " + doc.id });
      } else {
        res.json({ status: "error", message: "An error occurred while saving the book." });
      }
  });
};


/*
 * GET /books/:id
 */
exports.getBook = function(req, res) {

  // Connect to MongoDB
  mongoose.Promise = global.Promise;
  mongoose.connect(dbconfig.host, { useNewUrlParser: true });
  
  // Try to get a book from ID
  bookModel.findOne({_id: req.params.id}, function (err, result) {
    if (!err) {
      res.json(result);
    } else {
      res.json({ status: "error", message: "Book not found." });
    }
  })
};

/*
 * GET /books
 */
exports.addBooks = function(req, res) {
  var request = require('request');
  var cheerio = require('cheerio');

  // Request HTML from site
  request('http://kotlinlang.org/docs/books.html', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // res.send(error);
      const $ = cheerio.load(body);
      const length = $('.page-content.g-9 h2').length;
      var books = [];
      var links = 0;
  
      // Get data from each book
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
  
        // Request site from each book
        request(options, function (error,response,body) {
  
          // If success
          if (!error && response.statusCode == 200) {
            // Regex to get ISBN
            const $i = cheerio.load(body);
            let newBody = $i('body').text();
            let regexIsbn = /((?<!\d)|(?<=13|10))((9[-]*7[-]*([0-9Xx][-]*){11}|([0-9Xx][-]*){10}))(?!\d|[&=?])/;
            let isbn = newBody.match(regexIsbn) || "Undefined";

            isbn == "Undefined" ? obj.isbn = "Undefined" : obj.isbn = isbn[0];

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
    } else {
      res.json({ status: "error", message: "." });
    }
  });
};