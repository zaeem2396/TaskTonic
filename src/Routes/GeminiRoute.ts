import express, {Request, Response, Router} from 'express'
import GeminiController from "../Controller/GeminiController";

const router: Router = express.Router()
const geminiController = new GeminiController()

router.post('/gemini', (req: Request, res: Response) => {
    geminiController.getPrompt(req, res)
})

export default router