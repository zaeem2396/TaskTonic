import express, {Request, Response, Router} from 'express'
import CompanyController from '../Controller/CompanyController'

const router: Router = express.Router()

const companyController = new CompanyController()

router.post('/createCompany', (req: Request, res: Response) => {
    companyController.create(req, res)
})
router.post('/loginCompany', (req: Request, res: Response) => {
    companyController.login(req, res)
})
router.get('/getEmp', (req: Request, res: Response) => {
    companyController.fetchEmployee(req, res)
})

export default router;