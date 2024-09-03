const { pool } = require('../config/db')

class Orm {
    
    read = async (tableName) => {
        try {
            const sql = `SELECT * FROM ${tableName}`
            const [rows] = await pool.query(sql)
            return rows
        } catch (error) {
            console.error(`Error fetching record, error: ${error}`);
            throw error
        }
    }
    
    
}


module.exports = new Orm()