const DB = require('../Configurations/dbConnection');

// Home route: create customers table
const createCustomersTable = async (req, res) => {
    try {
        await DB.query(`CREATE TABLE IF NOT EXISTS Customers (
            custid SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            address TEXT,
            medicines TEXT,
            email TEXT,
            mobile TEXT UNIQUE NOT NULL
        )`);
        return res.json({ success: true, message: 'Customers table created (if not exists).' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Error creating Customers table.' });
    }
}

// Add customer
const addCustomer = async (req, res) => {
    const { name, address, medicines, email, mobile } = req.body || {};

    // Name validation - required
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Name is required and cannot be empty.' });
    }

    // Mobile validation - required, unique, and 10 digits
    if (!mobile || typeof mobile !== 'string' || mobile.trim() === '') {
        return res.status(400).json({ success: false, message: 'Mobile number is required and cannot be empty.' });
    }
    if (!/^\d{10}$/.test(mobile.trim())) {
        return res.status(400).json({ success: false, message: 'Mobile number must be exactly 10 digits.' });
    }

    // Process optional fields - convert empty strings to null
    const addressValue = (address && typeof address === 'string' && address.trim() !== '') ? address.trim() : null;
    const medicinesValue = (medicines && typeof medicines === 'string' && medicines.trim() !== '') ? medicines.trim() : null;
    const emailValue = (email && typeof email === 'string' && email.trim() !== '') ? email.trim() : null;

    try {
        const result = await DB.query(
            'INSERT INTO Customers (name, address, medicines, email, mobile) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name.trim(), addressValue, medicinesValue, emailValue, mobile.trim()]
        );
        return res.json({ success: true, message: 'Customer added successfully.', customer: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ success: false, message: 'Mobile number already exists. It must be unique.' });
        }
        console.log(err);
        return res.status(500).json({ success: false, message: 'Error adding customer.' });
    }
}

// Show all customers
const showCustomers = async (req, res) => {
    try {
        const { rows } = await DB.query('SELECT * FROM Customers ORDER BY custid');
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'No customers found.' });
        }
        return res.json({ success: true, data: rows });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Error fetching customers.' });
    }
}

// Modify customer
const modifyCustomer = async (req, res) => {
    const { custid } = req.params;
    const { name, address, medicines, email, mobile } = req.body || {};

    if (!custid || isNaN(custid)) {
        return res.status(400).json({ success: false, message: 'Valid Customer ID is required.' });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    // Name - if provided, cannot be empty
    if (name !== undefined) {
        if (typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ success: false, message: 'Name cannot be empty.' });
        }
        fields.push(`name = $${idx++}`);
        values.push(name.trim());
    }

    // Address - can be null or string
    if (address !== undefined) {
        const addressValue = (typeof address === 'string' && address.trim() !== '') ? address.trim() : null;
        fields.push(`address = $${idx++}`);
        values.push(addressValue);
    }

    // Medicines - can be null or string (comma separated allowed)
    if (medicines !== undefined) {
        const medicinesValue = (typeof medicines === 'string' && medicines.trim() !== '') ? medicines.trim() : null;
        fields.push(`medicines = $${idx++}`);
        values.push(medicinesValue);
    }

    // Email - can be null or string
    if (email !== undefined) {
        const emailValue = (typeof email === 'string' && email.trim() !== '') ? email.trim() : null;
        fields.push(`email = $${idx++}`);
        values.push(emailValue);
    }

    // Mobile - if provided, must be 10 digits and unique
    if (mobile !== undefined) {
        if (typeof mobile !== 'string' || mobile.trim() === '') {
            return res.status(400).json({ success: false, message: 'Mobile number cannot be empty.' });
        }
        if (!/^\d{10}$/.test(mobile.trim())) {
            return res.status(400).json({ success: false, message: 'Mobile number must be exactly 10 digits.' });
        }
        fields.push(`mobile = ${idx++}`);
        values.push(mobile.trim());
    }

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
        return res.json({ success: true, message: 'Customer updated successfully.', customer: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ success: false, message: 'Mobile number already exists. It must be unique.' });
        }
        console.log(err);
        return res.status(500).json({ success: false, message: 'Error updating customer.' });
    }
}

// Delete customer
const deleteCustomer = async (req, res) => {
    const { custid } = req.params;

    if (!custid || isNaN(custid)) {
        return res.status(400).json({ success: false, message: 'Valid Customer ID is required.' });
    }

    try {
        const result = await DB.query('DELETE FROM Customers WHERE custid = $1 RETURNING *', [custid]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Customer not found.' });
        }
        return res.json({ success: true, message: 'Customer deleted successfully.', customer: result.rows[0] });
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