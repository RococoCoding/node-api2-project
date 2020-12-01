const express = require('express');

const postsRoute = require('./postsRoute.js');

const router = express.Router(); 

router.use('/posts', postsRoute);

module.exports = router; 