class Validator {

    isRequired = (arg: any): boolean => {
        return arg != null && arg.toString().trim() !== '';
    }

    isStringValid = (arg: string) => {
        return arg.match('^[a-zA-Z ]+$')
    }

    isEmailValid = (arg: any) => {
        return arg.match('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    }

    doesRoleExist = (arg: string) => {
        const roles = ['ADMIN', 'EMP', 'EMPR']
        return roles.includes(arg)
    }

    isAdmin = (arg: string) => {
        return arg === 'ADMIN' ? true : false
    }

    isEmpr = (arg: string) => {
        return arg === 'EMPR' ? true : false
    }

    isEmp = (arg: string) => {
        return arg === 'EMP' ? true : false
    }
}

export default Validator