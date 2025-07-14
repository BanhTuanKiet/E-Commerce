import { createUser } from "../service/usersService.js"

export const signup = async (req, res, next) => {
    try {
        const data  = req.body
        if (data.role === undefined) {
            data.role = "customer"
        }

        const users = await createUser(data)

        return res.json({ data: users })
    } catch (error) {
        console.log(error)
    }
}