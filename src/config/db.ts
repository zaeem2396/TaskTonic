import mysql from 'mysql2/promise';
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

// function to test DB connection
const isDBConnected = async (): Promise<boolean> => {
    try {
        const connection = await pool.getConnection();
        connection.release();
        console.log('Connected to the database successfully!');
        return true; // Connection successful
    } catch (error: any) {
        console.log('Error connecting to the database:', error.message);
        return false; // Connection failed
    }
}

export { pool, isDBConnected }