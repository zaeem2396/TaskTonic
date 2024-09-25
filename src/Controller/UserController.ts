import { Request, Response } from 'express'
import User from "../Models/User";

class UserController {

    private user: User

    constructor() {
        this.user = new User()
    }

    create = async (req: Request, res: Response) => {
        try {
            const { orgId, name, email, password, role } = req.body
            const data = { orgId: orgId, name: name, email: email, password: password, role: role }
            const isUserCreated = await this.user.registerUser(data)
            return res.status(200).json(isUserCreated)
        } catch (error) {
            return res.status(500).json({ message: error })
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const data = { email: email, password: password }
            const isUserLoggedIn = await this.user.loginUser(data)
            return res.status(200).json(isUserLoggedIn)
        } catch (error) {
            return res.status(500).json({ message: error })
        }
    }

    get = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization?.split(' ')[1] || ''
            const data = { token: token }
            const isProfileFetched = await this.user.getProfile(data)
            return res.status(200).json(isProfileFetched)
        } catch (error) {
            return res.status(500).json({ message: error })
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization?.split(' ')[1] || ''
            const { name, email } = req.body
            const data = { token: token, name: name, email: email }
            const isUserProfleUpdated = await this.user.updateProfile(data)
            return res.status(200).json(isUserProfleUpdated)
        } catch (error) {
            return res.status(500).json({ message: error })
        }
    }
}

export default UserController