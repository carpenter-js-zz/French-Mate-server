'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const Words = require('../db/data');
const User = require('../models/user');

const router = express.Router();

router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  User.findOne({ _id: id })
    .then(user => {
      let currentQuestion = user.questions[user.head];
      res.json(currentQuestion);
    })
    .catch(err => {
      next(err);
    });
});

router.put('/:id', (req, res) => {
  let { attempts, correct, M, rightAnswer, englishWord, frenchWord} = req.body;
  let {id} = req.params;
  let toUpdate;

  if (rightAnswer) { 
    toUpdate = {
      attempts: attempts + 1,
      correct: correct + 1,
      M: M * 2,
      englishWord,
      frenchWord,
    };
  } else {
    toUpdate = {
      attempts: attempts + 1,
      correct,
      M: 1,
      englishWord,
      frenchWord,
    };
  }

  // ratings: [ { by: "ijk", rating: 4 } ]
  //   { $set:
  //     {
  //       "ratings.0.rating": 2
  //     }
  //  }

  let index = req.body.next - 1;
  let update = { '$set': {} };

  update['$set']['questions.'+index] = toUpdate;
 
  User.findOneAndUpdate({_id: id}, update)
    .then(user => { 
      res.json(user);
      // let tempHead = user.head;
      //this is not what we want 
      // let currentQuestion = user.questions[tempHead];
      // console.log('currentQuestion', currentQuestion);
      // let newLocation = currentQuestion.M;
      // console.log('newLocation', newLocation);
      // console.log('current quest.next', currentQuestion.next);
      // user.head = currentQuestion.next;
      // console.log('user.head', user.head);
      // currentQuestion.next = user.question[newLocation].next;
      // user.questions[newLocation].next = tempHead;
    });

  

});

module.exports = router;