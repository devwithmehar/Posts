const express = require('express');

const post = require('./post');
const auth = require('./auth');

const router = express.Router();

router.use('/', auth);

router.use('/post', post);

module.exports = router;
