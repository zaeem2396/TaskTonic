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

    find = async (tableName, searchParams) => {
        try {
            const columns = Object.keys(searchParams)
            const values = Object.values(searchParams)
            const whereClause = columns.map(column => `${column} = ?`).join(' AND ')

            const sql = `SELECT * FROM ${tableName} WHERE ${whereClause}`
            const [rows] = await pool.query(sql, values)
            return rows
        } catch (error) {
            console.error(`Error in fetching records, error: ${error}`);
            throw error
        }
    }

    create = async (tableName, data) => {
        try {
            const columns = Object.keys(data).join(', ')
            const values = Object.values(data)
            const placeholders = values.map(() => '?').join(', ')

            const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`
            const result = pool.query(sql, values)

            return result
        } catch (error) {
            console.error(`Error creating record, error: ${error}`);
            throw error
        }
    }

    update = async (tableName, id, data) => {
        try {
            const columns = Object.keys(data).map(key => `${key} = ?`).join(', ');
            const values = Object.values(data);

            const sql = `UPDATE ${tableName} SET ${columns} WHERE id = ?`;
            const [result] = await pool.query(sql, [...values, id]);

            return result
        } catch (error) {
            console.error(`Error updating record: ${error}`);
            throw error;
        }
    }

    delete = async (tableName, id) => {
        try {
            const sql = `DELETE FROM ${tableName} WHERE id = ?`
            const [result] = await pool.query(sql, [id])
            return result
        } catch (error) {
            console.error(`Error deleting record: ${error}`);
            throw error;
        }
    }
}


module.exports = new Orm()