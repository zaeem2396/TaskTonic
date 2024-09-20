import express, { Request, Response, Router } from "express";
import TaskController from "../Controller/TaskController";

const router: Router = express.Router();
const taskController = new TaskController();

router.post('/create', (req: Request, res: Response) => {
    taskController.create(req, res)
})

export default router