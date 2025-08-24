const DB = require('../Configurations/dbConnection');

const createProductsTable = async (req, res) => {
    try {
        await DB.query(`CREATE TABLE IF NOT EXISTS Products (
            pid SERIAL PRIMARY KEY,
            pname VARCHAR(100),
            pstock INTEGER,
            pPrice NUMERIC(10,2),
            purl TEXT
        )`);
        return res.json({ success: true, message: 'Products table created (if not exists).' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Error creating Products table.' });
    }
}

const addProduct = async (req, res) => {
    const { pname, pstock, pPrice, purl } = req.body;
    try {
        const result = await DB.query(
            'INSERT INTO Products (pname, pstock, pPrice, purl) VALUES ($1, $2, $3, $4) RETURNING *',
            [pname, pstock, pPrice, purl]
        );
        return res.json({ success: true, message: 'Product added.', product: result.rows[0] });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Error adding product.' });
    }
}


const getAllData = async (req, res) => {
    try {
        const { rows } = await DB.query('SELECT * FROM Products');
        if (rows.length > 0) {
            return res.json({ success: true, message: 'All Data :', data: rows })
        } else {
            return res.status(404).json({ success: false, message: 'No data found' })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Error in get all data API' })
    }
}

module.exports = {
    getAllData,
    createProductsTable,
    addProduct
}