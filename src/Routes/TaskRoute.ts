import express, { Request, Response, Router } from "express";
import TaskController from "../Controller/TaskController";

const router: Router = express.Router();
const taskController = new TaskController();

router.post('/createTask', (req: Request, res: Response) => {
    taskController.create(req, res)
})
router.get('/getTask', (req: Request, res: Response) => {
    taskController.get(req, res)
})

export default router