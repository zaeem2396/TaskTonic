import express, { Request, Response, Router } from 'express';
import SeedDataController from '../Controller/SeedDataController';

const router: Router = express.Router();
const seedDataController = new SeedDataController();

router.post('/seedTask', (req: Request, res: Response) => {
    seedDataController.populateTaskData(req, res)
})
router.post('/seedUsers', (req: Request, res: Response) => {
    seedDataController.populateUsersTable(req, res)
})

export default router