import { Request, Response } from 'express'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { pool } from '../config/db';
import Orm from '../Utils/Orm';
import { RowDataPacket } from 'mysql2/promise';
class GeminiController {

    private genAI: GoogleGenerativeAI;
    private orm: Orm;

    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
        this.orm = new Orm()
    }

    getPrompt = async (req: Request, res: Response) => {
        try {

            const { message } = req.body

            const informationSchemaQuery = "SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ?"
            const [informationSchemaQueryResult] = await pool.query<RowDataPacket[]>(informationSchemaQuery, ['todo']);
            const schemaData = informationSchemaQueryResult.map(row => `${row.TABLE_NAME} (${row.COLUMN_NAME})`).join(', ');

            const prompt = `This is my database schema: ${schemaData}. ${message}, just give me the SQL query, not the explanation.`;

            const aiModelName = await this.orm.find('appSettings', { name: 'aiModel' })

            const model = this.genAI.getGenerativeModel({ model: aiModelName[0].value.toString() });

            const result = await model.generateContent(prompt);

            if (result?.response?.candidates && result.response.candidates.length > 0) {
                const contentParts = result.response.candidates.map((candidate: any) => candidate.content?.parts || []).flat();
                return res.status(200).json(contentParts);
            } else {
                return res.status(200).json({ message: "No content generated" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error });
        }
    };
}

export default GeminiController