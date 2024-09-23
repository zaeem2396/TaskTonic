import { Request, Response } from 'express'
import Task from '../Models/Task'
import Lib from '../Utils/Lib'

class TaskController {

    private task: Task
    private lib: Lib

    constructor() {
        this.task = new Task()
        this.lib = new Lib()
    }

    create = async (req: Request, res: Response) => {
        try {
            const getDecodedToken = await this.lib.verifyToken(req.headers.authorization?.split(' ')[1] as string)
            const { title, description, assignedTo, priority, due_date } = req.body
            const data = { title: title, description: description, assignee: getDecodedToken.id, assignedTo: assignedTo ?? null, priority: priority, due_date: due_date, status: 'pending', }

            const isTaskCreated = await this.task.createTask(data)
            return res.status(200).json(isTaskCreated)
        } catch (error) {
            return res.status(500).json({ message: error })
        }
    }

    get = async (req: Request, res: Response) => {
        try {
            const {
                page = 1,
                limit = 10,
                orderBy = 'id',
                order = 'DESC',
                priority
            } = req.query;

            const paginationData = {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                orderBy: orderBy as string,
                order: order as string,
                priority: priority as string || undefined
            };

            const isTaskFetched = await this.task.getTask(paginationData);
            return res.status(200).json(isTaskFetched);
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    }
}

export default TaskController