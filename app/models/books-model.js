'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
  title: {
    type: String,
    required: 'Please enter a title'
  },
  description: {
    type: String,
    required: 'Please enter a description'
  },
  isbn: {
    type: String,
    required: 'Please enter a isbn code'
  },
  language: {
    type: String,
    required: 'Please enter a language'
  }
});

module.exports = mongoose.model('book', bookSchema);