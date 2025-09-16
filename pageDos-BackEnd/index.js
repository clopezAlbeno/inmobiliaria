'use strict'

require('dotenv').config();

const mysql = require('./config/mysql'); 
const app = require('./config/app');
app.initServer();
