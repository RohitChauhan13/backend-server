const express = require('express');
const { createTable, getAllData, createProductsTable, addProduct } = require('../Controllers/myController');
const Router = express.Router();

Router.get('/show-product', getAllData);

Router.get('/', createProductsTable);

Router.post('/add-product', addProduct);

module.exports = Router;