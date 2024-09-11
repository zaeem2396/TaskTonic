class Response {
    successResponse = (code: Number, message: string, data: any) => {
        return {
            code: code,
            message: message,
            data: data ?? []
        }
    }

    errorResponse = (message: string, code: number, error: any) => {
        return {
            code: code,
            message: message ?? 'Failure',
            error: error
        }
    }

    duplicateResponse = (message: string, code: number) => {
        return {
            code: code,
            message: message ?? 'Duplicate data found'
        }
    }
}

export default Response
