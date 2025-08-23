import admin from "firebase-admin"
import ErrorException from "../util/errorException.js"
import { userIsExist } from "../service/usersService.js"

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
    console.log(error)
    next(new ErrorException(401, "Your sessiong is expiry. Please Login again!"))
  }
}

export default authTokenFirebase
