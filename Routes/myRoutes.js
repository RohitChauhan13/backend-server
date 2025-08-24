const express = require('express');
const { createCustomersTable, addCustomer, showCustomers, modifyCustomer, deleteCustomer } = require('../Controllers/myController');
const Router = express.Router();


// Home route: create customers table
Router.get('/', createCustomersTable);

// Add customer
Router.post('/customer', addCustomer);

// Show all customers
Router.get('/customers', showCustomers);

// Modify customer (one or multiple fields)
Router.put('/customer/:custid', modifyCustomer);

// Delete customer
Router.delete('/customer/:custid', deleteCustomer);

module.exports = Router;