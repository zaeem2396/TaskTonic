class Response {
    successResponse = (code, message, data) => {
        return {
            code: code,
            message: message,
            data: data
        }
    }

    errorResponse = (message, code, error) => {
        return {
            code: code,
            message: message ?? 'Failure',
            error: error
        }
    }

    duplicateResponse = (message, code, data) => {
        return {
            code: code,
            message: message ?? 'Duplicate data found',
            data: data ?? ''
        }
    }
}

module.exports = new Response();
