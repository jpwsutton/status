/**
 * Status Server - index.js
 * 
 * Entrypoint for Server Application
 * 
 * Author: James Sutton 2018 - jsutton.co.uk, github.com/jpwsutton
 */
'use strict';
require('dotenv').config();
const app = require('./app');

const PORT  = process.env.HTTP_PORT || 9000;

app.listen(PORT, () => {
    console.log(`Status Server is listening on port ${PORT}!`);
});