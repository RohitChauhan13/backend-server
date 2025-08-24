const DB = require('../Configurations/dbConnection');

const getAllData = async (req, res) => {
    try {
        const [rows] = await DB.execute('SELECT * FROM DemoTable');
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
    getAllData
}