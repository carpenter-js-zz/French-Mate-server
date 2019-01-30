'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const Words = require('../db/data');
const User = require('../models/user');

const router = express.Router();

let index = 0;
router.get('/:id', (req, res, next) => {
  console.log('req.params is:', req.params);
  const { id } = req.params;
  // let word = Words.shift();
  // res.json(Words[index]);
  // index++;
  // if (index>9) {
  //   index = 0;
  // }

  User.findOne({ _id: id })
    .then(user => {
      let currentQuestion = user.questions[0];
      console.log('currentQuestion:', currentQuestion);
      res.json(currentQuestion);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;