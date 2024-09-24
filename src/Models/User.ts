import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Orm from '../Utils/Orm';
import Response from '../Utils/Response';
import Lib from '../Utils/Lib';
import Validator from '../Utils/Validator';

class User {

    private orm: Orm
    private lib: Lib
    private response: Response
    private validator: Validator

    constructor() {
        this.orm = new Orm()
        this.lib = new Lib()
        this.response = new Response()
        this.validator = new Validator()
    }

    registerUser = async (data: any) => {
        try {
            let validationErrors: Record<string, string> = {};

            const validateField = (field: string, validatorFn: Function, errorMsg: string) => {
                if (!validatorFn(data[field])) {
                    validationErrors[field] = errorMsg;
                }
            };

            validateField('name', this.validator.isRequired, 'Name is required');
            if (!validationErrors.name) validateField('name', this.validator.isStringValid, 'Name contains unwanted characters');

            validateField('email', this.validator.isRequired, 'Email is required');
            if (!validationErrors.email) validateField('email', this.validator.isEmailValid, 'Invalid email format');

            validateField('password', this.validator.isRequired, 'Password cannot be blank');

            validateField('role', this.validator.isRequired, 'Role is required');
            if (!validationErrors.role) validateField('role', this.validator.doesRoleExist, 'Invalid role');

            if (Object.keys(validationErrors).length > 0) {
                return this.response.errorResponse('Validation errors', 400, validationErrors);
            }
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
            if (isUserExists.length === 0) {
                return this.response.notFoundResponse('User not found or Invalid credentials', 404)
            }
            const user = isUserExists[0]
            if (user && bcrypt.compareSync(data.password, user.password)) {
                delete user.orgId
                delete user.password
                delete user.created_at
                delete user.updated_at
                const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY as string, { expiresIn: '1h' })
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

    getProfile = async (data: any) => {
        try {
            const isUserExist = await this.lib.verifyToken(data.token) as any
            if (!isUserExist) {
                return this.response.notFoundResponse('User not found', 404)
            }
            const getProfile = await this.orm.findOne('users', 'id', isUserExist.id)
            return this.response.successResponse(200, 'User profile', getProfile)
        } catch (error) {
            console.log(`Error getting user profile: ${error}`)
            return this.response.errorResponse('Processing failed due to technical fault', 500, error)
        }
    }

    updateProfile = async (data: any) => {
        try {
            const isUserExist = await this.lib.verifyToken(data.token) as any
            if (!isUserExist) {
                return this.response.notFoundResponse('User not found', 404)
            }
            const { token, ...updatedData } = data;
            const updateProfile = await this.orm.update('users', isUserExist.id, updatedData)
            if (updateProfile.affectedRows === 0) {
                return this.response.errorResponse('Failed to update user', 500, updateProfile)
            }

            const getUpdatedUser = await this.orm.findOne('users', 'id', isUserExist.id)
            delete getUpdatedUser.password
            return this.response.successResponse(200, 'User updated successfully', getUpdatedUser)
        } catch (error) {
            console.log(`Error updating user profile: ${error}`)
            return this.response.errorResponse('Processing failed due to technical fault', 500, error)
        }
    }
}

export default User