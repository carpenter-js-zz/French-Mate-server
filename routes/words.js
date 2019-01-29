'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const Words = require('../db/data');

const router = express.Router();

let index = 0;
router.get('/', (req, res, next) => {
  // let word = Words.shift();
  res.json(Words[index]);
  index++;
  if (index>9) {
    index = 0;
  }
});

module.exports = router;