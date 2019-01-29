'use strict';
// ---drop/seed db in CL---> node utils/seed-database.js

const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');

const Word = require('../models/word');


const Words = require('../db/data');

console.log(`Connecting to mongodb at ${DATABASE_URL}`);
mongoose.connect(DATABASE_URL, { useNewUrlParser: true })
  .then(() => {
    console.info('Delete Data');
    return Promise.all([
      Word.deleteMany(),
      // User.deleteMany()
    ]);
  })
  .then(() => {
    console.info('Seeding Database');
    return Promise.all([
      Word.insertMany(Words),
      // User.insertMany(users)
    ]);
  })
  .then(results => {
    console.log('Inserted', results);
    console.info('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });
