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
  let { userAnswer } = req.body;
  let {id} = req.params;

  User.findOne({_id: id})
    .then(user => { 
      // A
      let userObj = user.toJSON();
      let tempHead = userObj.head; // 0 
      let currentQuestion = userObj.questions[tempHead]; // A
      let i;
      for (i = 0; i < userObj.questions.length - 1; i++) {
        if (userAnswer === userObj.questions[i].englishWord) {
          if ( userObj.questions[i].M >= userObj.questions.length) {
            userObj.questions[i].M = 1;
            userObj.questions[i].attempts++;
            userObj.questions[i].correct++;
            userObj.questions[i].next = 1;
          } else {
            userObj.questions[i].attempts++;
            userObj.questions[i].correct++;
            userObj.questions[i].M = userObj.questions[i].M * 2;
            userObj.questions[i].next = 1;
          }
          break;
        } else {
          userObj.questions[i].correct;
          userObj.questions[i].attempts++;
          userObj.questions[i].M = 1;
          // userObj.questions[i].next;
          break;
        }
      }

      userObj.head = currentQuestion.next; // 1
      console.log('user.head', userObj.head);

      currentQuestion.next = userObj.questions[currentQuestion.M].next; //A next = I

      userObj.questions[currentQuestion.M].next = tempHead; 

      console.log( 'currentQuestion.next', currentQuestion.next);
      console.log('new current question previous now point at current', userObj.questions[currentQuestion.M].next);

      return userObj;
      

    }).then(updatedObj => {
      
      return updatedObj.save();
      // next();
    }).catch(err => console.log(err));
});

module.exports = router;