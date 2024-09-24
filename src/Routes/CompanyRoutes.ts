import express, {Request, Response, Router} from 'express'
import CompanyController from '../Controller/CompanyController'

const router: Router = express.Router()

const companyController = new CompanyController()

router.post('/createCompany', (req: Request, res: Response) => {
    companyController.create(req, res)
})

export default router;