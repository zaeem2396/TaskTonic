import Orm from "../Utils/Orm";
import Response from "../Utils/Response";
import Validator from "../Utils/Validator";
import bcrypt from 'bcryptjs';

class Company {

    private orm: Orm
    private response: Response
    private validator: Validator

    constructor() {
        this.orm = new Orm()
        this.response = new Response()
        this.validator = new Validator()
    }

    registerCompany = async (data: any) => {
        try {
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
                return this.response.errorResponse('Email already exists', 409, isOrganizationExists)
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
}

export default Company