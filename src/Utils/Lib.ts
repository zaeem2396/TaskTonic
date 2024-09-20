import Response from "./Response";
import jwt, { JwtPayload } from 'jsonwebtoken'

interface CustomJWTPayload extends JwtPayload {
    id: number
}
class Lib {

    private response: Response

    constructor() {
        this.response = new Response()
    }

    formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');  // Month is 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    verifyToken = async (token: string): Promise<CustomJWTPayload | any> => {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY as string)
            return decoded
        } catch (error) {
            return this.response.errorResponse('Failed to verify token', 500, error)
        }
    }

}

export default Lib