const express = require('express');
const server = express();

const apiRoute = require('./api/apiRoute.js');
server.use(express.json());

server.use('/api', apiRoute);

server.listen(8000, () => console.log('API running on port 8000'));

