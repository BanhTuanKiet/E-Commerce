import ErrorException from "../util/error.js"

export const authRole = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            const { role } = req.user
console.log("AAAAAAAA")
            if (!allowedRoles.includes(role)) {
                throw new ErrorException(403, "Access denied!")
            }

            next()
        } catch (error) {
            next(error)
        }
    }
}
