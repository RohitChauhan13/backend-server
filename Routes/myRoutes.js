const express = require('express');
const { getAllData } = require('../Controllers/myController');
const Router = express.Router();

Router.get('/', getAllData)

module.exports = Router;