const admin = require("firebase-admin")
const ErrorException = require("../util/errorException.js")
const { userIsExist } = require("../service/usersService.js")

const authTokenFirebase = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken
    
    if (!token) {
      throw new ErrorException(401, "Please login to continue!")
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token)

    const user = await userIsExist(decodedToken.email)
 
    req.user = user
    next()
  } catch (error) {
    next(new ErrorException(401, "Your session is expired. Please Login again!"))
  }
}

module.exports = authTokenFirebase