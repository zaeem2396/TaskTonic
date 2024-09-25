import jwt from 'jsonwebtoken'
import Orm from "../Utils/Orm";
import Lib from "../Utils/Lib";
import Response from "../Utils/Response";
import Validator from "../Utils/Validator";
import bcrypt from 'bcryptjs';

class Company {

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

    registerCompany = async (data: any) => {
        try {

            if (!data.token) {
                return this.response.errorResponse('Token is required', 400, {})
            }

            const isTokenValid = await this.lib.verifyToken(data.token)
            const getRole = await this.orm.findOne('users', 'id', isTokenValid.id)

            if (!this.validator.isAdmin(getRole.role)) {
                return this.response.errorResponse('Unauthorized access', 401, {})
            }

            let validationErrors: Record<string, string> = {};

            const validateField = (field: string, validatorFn: Function, errorMsg: string) => {
                if (!validatorFn(data[field])) {
                    validationErrors[field] = errorMsg;
                }
            };

            validateField('orgName', this.validator.isRequired, 'Organization name is required');
            if (!validationErrors.orgName) validateField('orgName', this.validator.isStringValid, 'Organization name has invalid characters');

            validateField('name', this.validator.isRequired, 'Invalid name');
            if (!validationErrors.name) validateField('name', this.validator.isStringValid, 'Name has invalid characters');

            validateField('email', this.validator.isRequired, 'Email is required');
            if (!validationErrors.email) validateField('email', this.validator.isEmailValid, 'Invalid email format');

            validateField('password', this.validator.isRequired, 'Password cannot be blank');

            validateField('role', this.validator.isRequired, 'Role is required');
            if (!validationErrors.role) validateField('role', this.validator.doesRoleExist, 'Invalid role');

            if (Object.keys(validationErrors).length > 0) {
                return this.response.errorResponse('Validation error', 400, validationErrors)
            }

            const isOrganizationExists = await this.orm.findOne('org', 'email', data.email)
            if (isOrganizationExists) {
                return this.response.errorResponse('Organization with this email already exists', 409, {})
            }

            const isOrganizationRegistered = {
                orgName: data.orgName,
                name: data.name,
                email: data.email,
                password: bcrypt.hashSync(data.password, 10),
                role: data.role
            }

            const isCompanyCreated = await this.orm.create('org', isOrganizationRegistered)
            if (!isCompanyCreated) {
                return this.response.errorResponse('Failed to create company', 500, isCompanyCreated)
            }
            return this.response.successResponse(201, 'Company created successfully', isCompanyCreated)
        } catch (error) {
            console.log(`Error creating company: ${error}`)
            return this.response.errorResponse('Processing failed due to technical fault', 500, error)
        }
    }

    loginOrganization = async (data: any) => {
        try {
            const isOrganizationExists = await this.orm.find('org', { email: data.email })
            if (!isOrganizationExists) {
                return this.response.notFoundResponse('Organization not found or Invalid credentials', 404)
            }

            const organization = isOrganizationExists[0]
            if (organization && bcrypt.compareSync(data.password, organization.password)) {

                delete organization.password
                delete organization.createdAt
                delete organization.updatedAt

                const token = jwt.sign({ id: organization.id }, process.env.SECRET_KEY as string, { expiresIn: '1h' })
                const response = {
                    organization: organization,
                    token: token
                }
                return this.response.successResponse(200, 'Organization logged in successfully', response)
            } else {
                return this.response.notFoundResponse('Failed to login organization', 404)
            }
        } catch (error) {
            console.log(`Error logging in user: ${error}`)
            return this.response.errorResponse('Processing failed due to technical fault', 500, error)
        }
    }

    getListOfEmp = async (data: any) => {
        try {
            if (!data.token) {
                return this.response.errorResponse('Token is required', 400, {})
            }

            const isTokenValid = await this.lib.verifyToken(data.token)
            const getRole = await this.orm.findOne('users', 'id', isTokenValid.id)
            console.log(!this.validator.isAdmin(getRole.role), !this.validator.isEmpr(getRole.role));

            if (!this.validator.isEmp(getRole.role)) {
                return this.response.errorResponse('Unauthorized access', 401, {})
            }
            let fetchEmpData
            if (getRole.orgId == '0') {
                fetchEmpData = this.orm.read('users')
            } else {
                fetchEmpData = this.orm.find('users', { orgId: getRole.orgId })
            }
            return this.response.successResponse(200, 'Employee list fetched successfully', await fetchEmpData)
        } catch (error) {
            console.log(`Error fetching employee list: ${error}`);
            return this.response.errorResponse('Processing failed due to technical fault', 500, error)
        }
    }
}

export default Company