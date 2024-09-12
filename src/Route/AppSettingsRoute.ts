import express, { Request, Response, Router } from 'express';
import AppSettingsController from '../Controller/AppSettingsController'

const router: Router = express.Router();
const appSettingsController = new AppSettingsController()

router.get('/appSettings', (req: Request, res: Response) => {
    appSettingsController.getSettings(req, res)
})
router.post('/appSettings', (req: Request, res: Response) => {
    appSettingsController.createSettings(req, res)
})
router.put('/appSettings', (req: Request, res: Response) => {
    appSettingsController.updateSettings(req, res)
})
router.delete('/appSettings', (req: Request, res: Response) => {
    appSettingsController.deleteSettings(req, res)
})

export default router;