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

router.put('/:id', (req, res, next) => {
  let userAnswer = req.body.englishWord;
  let {id} = req.params;

  User.findOne({_id: id})
    .then(user => { 
      // A
      let userObj = user.toJSON();
      let tempHead = userObj.head; // 0 
      let currentQuestion = userObj.questions[tempHead]; // A

      if (userAnswer === userObj.questions[tempHead].englishWord) {
        userObj.questions[tempHead].attempts = userObj.questions[tempHead].attempts + 1;
        userObj.questions[tempHead].correct = userObj.questions[tempHead].correct + 1;
        userObj.questions[tempHead].M = userObj.questions[tempHead].M * 2;
      } else {
        console.log('IN HERE');
        console.log('userAnswer: ', userAnswer, 'correct answer', userObj.questions[tempHead].englishWord);
        userObj.questions[tempHead].correct;
        userObj.questions[tempHead].attempts = userObj.questions[tempHead].attempts + 1;
        userObj.questions[tempHead].M = 1;
      }

      // if (userObj.questions[tempHead].M > 8) {
      //   console.log('----------------------------------userObj.questions[tempHead].M', userObj.questions[tempHead].M);
      //   userObj.questions[tempHead].M = 1;
      // }

      let index = currentQuestion.M + tempHead;
      if (index > user.questions.length - 1) {
        index = user.questions.length - 1;
      }
      userObj.head = currentQuestion.next; // 1
      currentQuestion.next = userObj.questions[index].next; //A next = I
      userObj.questions[index].next = tempHead; 
      console.log('whole object after algo', userObj);

      console.log(userObj.head);
      if (userObj.head === null) {
        userObj.head = 0;
      }

      return user.update(userObj);    

    })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
      
  // return updatedObj.save();
  // next();
});

module.exports = router;