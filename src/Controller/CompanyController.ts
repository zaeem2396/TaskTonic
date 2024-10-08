import { Request, Response } from 'express'
import Company from "../Models/Company";

class CompanyController {

    private company: Company

    constructor() {
        this.company = new Company()
    }

    create = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization?.split(' ')[1] || ''
            const { orgName, name, email, password, role } = req.body
            const data = { token: token, orgName: orgName, name: name, email: email, password: password, role: role }
            const isCompanyRegistered = await this.company.registerCompany(data)
            return res.status(200).json(isCompanyRegistered)
        } catch (error) {
            return res.status(500).json({ message: error })
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const data = { email: email, password: password }
            const isCompanyLoggedIn = await this.company.loginOrganization(data)
            return res.status(200).json(isCompanyLoggedIn)
        } catch (error) {
            return res.status(500).json({ message: error })
        }
    }

    fetchEmployee = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization?.split(' ')[1] || ''
            const data = { token: token }
            const isEmployeeFetched = await this.company.getListOfEmp(data)
            return res.status(200).json(isEmployeeFetched)
        } catch (error) {
            return res.status(500).json({ message: error })
        }
    }
}

export default CompanyController