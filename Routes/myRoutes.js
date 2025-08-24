const express = require('express');
const { createCustomersTable, addCustomer, showCustomers, modifyCustomer, deleteCustomer, deleteAllTables } = require('../Controllers/myController');
const Router = express.Router();


// Home route: create customers table
Router.get('/', createCustomersTable);

// Add customer
Router.post('/add-customer', addCustomer);

// Show all customers
Router.get('/show-customer', showCustomers);

// Modify customer (one or multiple fields)
Router.put('/customer/:custid', modifyCustomer);

// Delete customer
Router.delete('/customer/:custid', deleteCustomer);

// Delete all tables from database.
Router.delete('/deleteAllTables', deleteAllTables);

module.exports = Router;