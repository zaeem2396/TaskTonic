import { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { pool } from '../config/db'

class Orm {

    read = async (tableName: string): Promise<RowDataPacket[]> => {
        try {
            const sql = `SELECT * FROM ${tableName} ORDER BY id DESC`
            const [rows] = await pool.query<RowDataPacket[]>(sql)
            return rows
        } catch (error: any) {
            console.error(`Error fetching record, error: ${error}`);
            throw error
        }
    }

    find = async (tableName: string, searchParams: Record<any, string>): Promise<RowDataPacket[]> => {
        try {
            const columns = Object.keys(searchParams)
            const values = Object.values(searchParams)
            const whereClause = columns.map(column => `${column} = ?`).join(' AND ')

            const sql = `SELECT * FROM ${tableName} WHERE ${whereClause}`
            const [rows] = await pool.query<RowDataPacket[]>(sql, values)
            return rows
        } catch (error: any) {
            console.error(`Error in fetching records, error: ${error}`);
            throw error
        }
    }

    create = async (tableName: string, data: Record<any, string>): Promise<ResultSetHeader> => {
        try {
            const columns = Object.keys(data).join(', ')
            const values = Object.values(data)
            const placeholders = values.map(() => '?').join(', ')

            const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`
            const [result] = await pool.query<ResultSetHeader>(sql, values)

            return result
        } catch (error: any) {
            console.error(`Error creating record, error: ${error}`);
            throw error
        }
    }

    update = async (tableName: string, id: number, data: Record<any, string>): Promise<ResultSetHeader> => {
        try {
            const columns = Object.keys(data).map(key => `${key} = ?`).join(', ');
            const values = Object.values(data);

            const sql = `UPDATE ${tableName} SET ${columns} WHERE id = ?`;
            const [result] = await pool.query<ResultSetHeader>(sql, [...values, id]);

            return result
        } catch (error: any) {
            console.error(`Error updating record: ${error}`);
            throw error;
        }
    }

    delete = async (tableName: string, id: number): Promise<ResultSetHeader> => {
        try {
            const sql = `DELETE FROM ${tableName} WHERE id = ?`
            const [result] = await pool.query<ResultSetHeader>(sql, [id])
            return result
        } catch (error: any) {
            console.error(`Error deleting record: ${error}`);
            throw error;
        }
    }

    findOne = async (tableName: string, column: string, value: any): Promise<RowDataPacket> => {
        try {
            const sql = `SELECT * FROM ${tableName} WHERE ${column} = ?`
            const [rows] = await pool.query<RowDataPacket[]>(sql, [value])
            return rows[0]
        } catch (error: any) {
            console.error(`Error fetching record: ${error}`);
            throw error;
        }
    }
}


export default Orm