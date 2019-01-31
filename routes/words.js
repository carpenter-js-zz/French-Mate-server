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
      console.log('userObj length:', userObj.questions.length - 1);
      // for (let i = 0; i < userObj.questions.length - 1; i++) {
      //   let question;
      //   if (userAnswer === userObj.questions[i].englishWord) {
      //     question = userObj.questions[i].englishWord;
      //     // if ( userObj.questions[i].M >= userObj.questions.length) {
      //     // console.log('---------///////////////////////English word is:', userObj.questions[i].englishWord);
      //     // userObj.questions[i].M = 1;
      //     // userObj.questions[i].attempts++;
      //     // userObj.questions[i].correct++; 
      //     //  } else {
      //     console.log('---------///////////////////////English word is:', userObj.questions[i].englishWord);
      //     userObj.questions[i].attempts = userObj.questions[i].attempts + 1;
      //     userObj.questions[i].correct = userObj.questions[i].correct + 1;
      //     userObj.questions[i].M = userObj.questions[i].M * 2;
      //     // }
          
      //   } else {
      //     userObj.questions[i].correct;
      //     userObj.questions[i].attempts = userObj.questions[i].attempts + 1;
      //     userObj.questions[i].M = 1;
      //     // userObj.questions[i].next;
      //     console.log('WRONG----------------------');
      //   }
      // }

      if (userAnswer === userObj.questions[tempHead].englishWord) {
       
        // if ( userObj.questions[tempHead].M >= userObj.questions.length) {
        // console.log('---------///////////////////////English word is:', userObj.questions[tempHead].englishWord);
        // userObj.questions[tempHead].M = 1;
        // userObj.questions[tempHead].attempts++;
        // userObj.questions[tempHead].correct++; 
        //  } else {
        console.log('---------///////////////////////English word is:', userObj.questions[tempHead].englishWord);
        userObj.questions[tempHead].attempts = userObj.questions[tempHead].attempts + 1;
        userObj.questions[tempHead].correct = userObj.questions[tempHead].correct + 1;
        userObj.questions[tempHead].M = userObj.questions[tempHead].M * 2;
        // }
        
      } else {
        userObj.questions[tempHead].correct;
        userObj.questions[tempHead].attempts = userObj.questions[tempHead].attempts + 1;
        userObj.questions[tempHead].M = 1;
        // userObj.questions[i].next;
        console.log('WRONG----------------------');
      }


      console.log('user object after ifs', userObj);
      userObj.head = currentQuestion.next; // 1
      console.log('head is now:', userObj.head);
      currentQuestion.next = userObj.questions[currentQuestion.M + tempHead].next; //A next = I
      console.log('current question next is now:', currentQuestion.next);
      userObj.questions[currentQuestion.M + tempHead].next = tempHead; 
      console.log('the question current question is now following:', userObj.questions[currentQuestion.M +  tempHead].next);
      console.log('whole object after algo', userObj);
      // console.log(user.save(userObj));
      // return user;
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