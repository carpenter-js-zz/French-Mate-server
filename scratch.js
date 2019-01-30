// return User.create(newUser);
// return new User({newUser}
// if word schema: 
// .then(user => QuestionCollection.find().then(questions =>
// question: question.englishWord, answer: question.frenchword,
// ---- refactor ----
// .then(({user, questions}) => { 
//   user.questions = questions.map((question, index) => ({
//     next: index === questions.length - 1 ? null : index + 1,
//     mValue: 1,
//     correct: 0,
//     incorrect:0
//   }))
//   user.save()
// }))

'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
        
const User = require('../models/user');
const Data = require('../db/data');
        
router.post('/', (req, res, next) => {
          
        
  // --- VALIDATION --- \\
        
  // Validate username and password were provided
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));
        
  if (missingField) {
    const err = new Error(`missing '${missingField}' in request body`);
    err.status = 422;
    return next(err);
  }
        
  // Validate that everything is coming in as a String
  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string');
        
  if (nonStringField) {
    const err = new Error(`'${nonStringField}' must be a string`);
    err.status = 422;
    return next(err);
  }
        
  // Validate username and password have no whitespace
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );
        
  if (nonTrimmedField) {
    const err = new Error(`'${nonTrimmedField}' cannot have white space.`);
    err.status = 422;
    return next(err);
  }
        
  // Validate lengths of username and password
  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 10,
      max: 72
    }
  };
        
  const tooSmallField = Object.keys(sizedFields).find(field => 
    'min' in sizedFields[field] && 
            req.body[field].trim().length < sizedFields[field].min);
        
  const tooLargeField = Object.keys(sizedFields).find(field => 
    'max' in sizedFields[field] &&
              req.body[field].trim().length > sizedFields[field].max
  );
        
  if (tooSmallField) {
    const min = sizedFields[tooSmallField].min;
    const err = new Error(`Field: '${tooSmallField}' must be at least ${min} characters long`);
    err.status = 422;
    return next(err);
  }
        
  if (tooLargeField) {
    const max = sizedFields[tooLargeField].max;
    const err = new Error(`Field: '${tooLargeField}' must be at most ${max} characters long`);
    err.status = 422;
    return next(err);
  }
  console.log(req.body);
  let { username, password, firstName, lastName } = req.body;
  firstName = firstName.trim();
  lastName = lastName.trim();
  const questions = Data;
        
          
  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username,
        password: digest,
        firstName,
        lastName,
        questions
      };
      return new User({newUser});
    })
    .then(({newUser, questions}) => {
      newUser.questions = questions.map((question, index) => ({
        next: index === questions.length - 1 ? null : index + 1,
        M: 1,
        correct: 0,
        attempts: 0
      }));
      newUser.save();
    })  
    .then(result => {
      return res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      next(err);
    });
        
  // Unprotected endpoint
  // User.create(newUser)
  //   .then(result => {
  //     res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
  //   })
  //   .catch(err => {
  //     next(err);
  //   });
});
        
module.exports = router;