const ErrorException = require("../util/errorException.js")

const authRole = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            const { role } = req.user

            if (!allowedRoles.includes(role)) {
                throw new ErrorException(403, "Access denied!")
            }

            next()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = authRole