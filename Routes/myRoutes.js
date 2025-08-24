const express = require('express');
const { createTable, getAllData } = require('../Controllers/myController');
const Router = express.Router();

Router.get('/', createTable);
Router.get('/data', getAllData);

module.exports = Router;