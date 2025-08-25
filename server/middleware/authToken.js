const jwt = require("jsonwebtoken")
const ErrorException = require("../util/errorException.js")
const { getRefreshToken } = require("../service/usersService.js")
const { generateToken } = require("../util/tokenUtil.js")

const authToken = async (req, res, next) => {
    try {
        const token = await req.cookies.accessToken

        if (!token) {
            throw new ErrorException(401, "Please login to continue!")
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        req.user = decoded
        
        next()
    } catch (error) {
        if (error.name !== 'TokenExpiredError' || error.statusCode === 401) {
            return next(error)
        }
        
        try {
            const decoded = jwt.decode(req.cookies.accessToken)
            const refreshToken = await getRefreshToken(decoded._id)

            const verified = jwt.verify(refreshToken.refreshToken, process.env.SECRET_KEY)

            if (!verified) {
                throw new ErrorException(403, "Your sessiong is expiry. Please Login again!")
            }

            const accessToken = generateToken(decoded._id, decoded.role, 1 * 100)
    
            res.cookie('accessToken', accessToken, { 
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 3600 * 1000
            }) 

            req.user = decoded

            next()
        } catch (refreshTokenError) {
            next(refreshTokenError)
        }
    }
}

module.exports = authToken