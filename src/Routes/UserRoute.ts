import express, { Request, Response, Router } from 'express'
import UserController from '../Controller/UserController'
import GeminiController from '../Controller/GeminiController'

const router: Router = express.Router()
const userController = new UserController()
const geminiController = new GeminiController

router.post('/createUser', (req: Request, res: Response) => {
    userController.create(req, res)
})
router.post('/login', (req: Request, res: Response) => {
    userController.login(req, res)
})
router.post('/get', (req: Request, res: Response) => {
    userController.get(req, res)
})
router.patch('/update', (req: Request, res: Response) => {
    userController.update(req, res)
})

router.get('/gemini', (req: Request, res: Response) => {
    geminiController.getPrompt(req, res)
})

export default router