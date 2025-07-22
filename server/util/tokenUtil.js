import jwt from "jsonwebtoken"
import ErrorException from "../util/error.js"

export const generateToken = (_id, role, expire) => {
    try {
        return jwt.sign({ _id: _id, role: role }, process.env.SECRET_KEY, { expiresIn: expire })
    } catch (error) {
        throw new ErrorException(500, error)
    }
}
