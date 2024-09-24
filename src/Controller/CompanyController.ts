import { Request, Response } from 'express'
import Company from "../Models/Company";

class CompanyController {

    private company: Company

    constructor() {
        this.company = new Company()
    }

    create = async (req: Request, res: Response) => {
        try {
            const { orgName, name, email, password, role } = req.body
            const data = { orgName: orgName, name: name, email: email, password: password, role: role }
            const isCompanyRegistered = await this.company.registerCompany(data)
            return res.status(200).json(isCompanyRegistered)
        } catch (error) {
            return res.status(500).json({ message: error })
        }
    }
}

export default CompanyController