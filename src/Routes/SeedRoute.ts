import express, { Request, Response, Router } from 'express';
import SeedDataController from '../Controller/SeedDataController';

const router: Router = express.Router();
const seedDataController = new SeedDataController();

router.post('/seedData', (req: Request, res: Response) => {
    seedDataController.populateTaskData(req, res)
})

export default router