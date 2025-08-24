const DB = require('../Configurations/dbConnection');

// Home route: create customers table
const createCustomersTable = async (req, res) => {
    try {
        await DB.query(`CREATE TABLE IF NOT EXISTS Customers (
            custid SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            address TEXT,
            medicines TEXT[],
            email VARCHAR(100),
            mobile VARCHAR(20) UNIQUE
        )`);
        return res.json({ success: true, message: 'Customers table created (if not exists).' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Error creating Customers table.' });
    }
}

// Add customer
const addCustomer = async (req, res) => {
    const { name, address, medicines, email, mobile } = req.body;
    if (!name || !mobile) {
        return res.status(400).json({ success: false, message: 'Name and mobile are required.' });
    }
    if (!Array.isArray(medicines)) {
        return res.status(400).json({ success: false, message: 'Medicines must be an array.' });
    }
    try {
        const result = await DB.query(
            'INSERT INTO Customers (name, address, medicines, email, mobile) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, address || '', medicines, email || '', mobile]
        );
        return res.json({ success: true, message: 'Customer added.', customer: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ success: false, message: 'Mobile number must be unique.' });
        }
        console.log(err);
        return res.status(500).json({ success: false, message: 'Error adding customer.' });
    }
}

// Show all customers
const showCustomers = async (req, res) => {
    try {
        const { rows } = await DB.query('SELECT * FROM Customers');
        if (rows.length > 0) {
            return res.json({ success: true, data: rows });
        } else {
            return res.status(404).json({ success: false, message: 'No customers found.' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Error fetching customers.' });
    }
}

// Modify customer (one or multiple fields)
const modifyCustomer = async (req, res) => {
    const { custid } = req.params;
    const { name, address, medicines, email, mobile } = req.body;
    if (!custid) {
        return res.status(400).json({ success: false, message: 'Customer ID required.' });
    }
    // Build dynamic query
    const fields = [];
    const values = [];
    let idx = 1;
    if (name) { fields.push(`name = $${idx++}`); values.push(name); }
    if (address) { fields.push(`address = $${idx++}`); values.push(address); }
    if (Array.isArray(medicines)) { fields.push(`medicines = $${idx++}`); values.push(medicines); }
    if (email) { fields.push(`email = $${idx++}`); values.push(email); }
    if (mobile) { fields.push(`mobile = $${idx++}`); values.push(mobile); }
    if (fields.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields to update.' });
    }
    values.push(custid);
    try {
        const result = await DB.query(
            `UPDATE Customers SET ${fields.join(', ')} WHERE custid = $${idx} RETURNING *`,
            values
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Customer not found.' });
        }
        return res.json({ success: true, message: 'Customer updated.', customer: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ success: false, message: 'Mobile number must be unique.' });
        }
        console.log(err);
        return res.status(500).json({ success: false, message: 'Error updating customer.' });
    }
}

// Delete customer
const deleteCustomer = async (req, res) => {
    const { custid } = req.params;
    if (!custid) {
        return res.status(400).json({ success: false, message: 'Customer ID required.' });
    }
    try {
        const result = await DB.query('DELETE FROM Customers WHERE custid = $1 RETURNING *', [custid]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Customer not found.' });
        }
        return res.json({ success: true, message: 'Customer deleted.', customer: result.rows[0] });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Error deleting customer.' });
    }
}

module.exports = {
    createCustomersTable,
    addCustomer,
    showCustomers,
    modifyCustomer,
    deleteCustomer
}