'use strict';
const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  frenchWord: String,
  englishWord: String,
  // M: Number,
  userId: [{
    correct: Number,
    attempts: Number,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    M: Number
  }]
  // score: [{
  //   correct: Number,
  //   attempts: Number,
  //   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  //   M: Number
  // }]

});

wordSchema.set('timestamps', true);

// Restrics response body from database
wordSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

module.exports = mongoose.model('Word', wordSchema);

// User answers question, submits, send put request to find currentWord 
