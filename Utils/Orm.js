const { pool } = require('../config/db')
const read = async (tableName) => {
    try {
        const sql = `SELECT * FROM ${tableName}`
        const [rows, _] = await pool.query(sql)
        return rows
    } catch (error) {
        console.error(`Error fetching record, error: ${error}`);
        throw error
    }
}


module.exports = { read }