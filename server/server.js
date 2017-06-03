const express = require('express');
const api = require('./api');

const server = express();

server.use(express.static(`${__dirname}/../build`));

server.use('/api', api);

server.listen(process.env.PORT || 3000);
