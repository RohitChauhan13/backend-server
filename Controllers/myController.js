const DB = require('../Configurations/dbConnection');


const createTable = async (req, res) => {
    try {
        await DB.query(`CREATE TABLE IF NOT EXISTS DemoTable (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            value VARCHAR(100)
        )`);
        return res.json({ success: true, message: 'DemoTable created (if not exists).' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Error creating table.' });
    }
}

const getAllData = async (req, res) => {
    try {
        const { rows } = await DB.query('SELECT * FROM DemoTable');
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
    createTable,
    getAllData
}