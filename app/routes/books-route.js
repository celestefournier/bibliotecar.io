'use strict';
module.exports = function(app) {
  var booksController = require('../controllers/books-controller');

  app.route('/book')
    .post(booksController.addBook);
  
  app.route('/books/:id')
    .get(booksController.getBook);

  app.route('/books')
    .get(booksController.addBooks);
};