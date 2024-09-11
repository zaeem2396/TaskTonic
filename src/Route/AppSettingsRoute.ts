import express, { Request, Response, Router } from 'express';
import AppSettingsController from '../Controller/AppSettingsController'

const router: Router = express.Router();

router.get('/appSettings', (req: Request, res: Response) => {
    AppSettingsController.getSettings(req, res)
})
router.post('/appSettings', (req: Request, res: Response) => {
    AppSettingsController.createSettings(req, res)
})
router.put('/appSettings', (req: Request, res: Response) => {
    AppSettingsController.updateSettings(req, res)
})

export default router;