'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const Words = require('../db/data');

const router = express.Router();

router.get('/', (req, res, next) => {
  let word = Words.shift();
  res.json(word);
});

module.exports = router;