import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Orm from '../Utils/Orm';
import Response from '../Utils/Response';

class User {

    private orm: Orm
    private response: Response

    constructor() {
        this.orm = new Orm()
        this.response = new Response()
    }

    registerUser = async (data: any) => {
        try {
            const isUserExists = await this.orm.find('users', { email: data.email })
            if (isUserExists.length > 0) {
                return this.response.duplicateResponse('User already exists', 409)
            }
            const registerUser = {
                name: data.name,
                email: data.email,
                password: bcrypt.hashSync(data.password, 10),
                role: data.role
            }
            const isUserRegistered = await this.orm.create('users', registerUser)
            if (isUserRegistered.affectedRows === 0) {
                return this.response.errorResponse('Failed to register user', 500, isUserRegistered)
            }
            return this.response.successResponse(200, 'User created successfully', isUserRegistered)
        } catch (error) {
            console.log(`Error creating user: ${error}`)
            return this.response.errorResponse('Processing failed due to technical fault', 500, error)
        }
    }

    loginUser = async (data: any) => {
        try {
            const isUserExists = await this.orm.find('users', { email: data.email })
            const JWT_SECRET = 'yCtkmo9elWtY5c+1Nq9mxJ1aw3aG2gNOOCFt4IqEFCgmUgi6vsBESqXL8WcdSSJ/vEhDzp5//H74w5RCodVk2Giibijlgdxsa+no4CjmVEY0CI956awTNOWNt6F9aqTc74hJLcc9tdppErkldLzh/8jUZ2MBAHVMCH2I9AVuPPi0G3w3Ji4FTYDY4SBvA4AQbd98EHxtt5ztuBamF+Z/v89abbB1COd6VpjVVpE/9O/vk5lrP4YDTcy2BbwuwGERgp9HhYcaFMY9Iv2o/7JAvdXbNSLC4owxu0DkM9Qxj/AQOAWUsfYdmTIzMN555vJBIE+5QkGbpGWjQLTAysTEjw=='
            if (isUserExists.length === 0) {
                return this.response.notFoundResponse('User not found or Invalid credentials', 404)
            }
            const user = isUserExists[0]
            if (user && bcrypt.compareSync(data.password, user.password)) {
                delete user.password
                delete user.created_at
                delete user.updated_at
                const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' })
                const response = {
                    user: user,
                    token: token
                }
                return this.response.successResponse(200, 'User logged in successfully', response)
            } else {
                return this.response.notFoundResponse('Failed to login user', 404)
            }
        } catch (error) {
            console.log(`Error logging in user: ${error}`)
            return this.response.errorResponse('Processing failed due to technical fault', 500, error)
        }
    }
}

export default User