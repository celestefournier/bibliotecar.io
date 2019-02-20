'use strict';
module.exports = function(app) {
  var booksController = require('../controllers/books-controller');   // Import controller

  // POST /book
  app.route('/book')
    .post(booksController.addBook);
  
  // GET /book/:id
  app.route('/books/:id')
    .get(booksController.getBook);

  // GET /books
  app.route('/books')
    .get(booksController.addBooks);
};