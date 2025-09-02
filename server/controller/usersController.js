const { createUser, findUserById, saveRefreshToken, userIsExist, updateUser, filterUsers } = require("../service/usersService.js")
const ErrorException = require("../util/errorException.js")
const { sendMail } = require("../util/mailUtl.js")
const { generateOTP, verifyOTP } = require("../util/otpUtil.js")
const client = require("../config/redis.js")
const { hashPassword, comparePassword } = require("../util/passwordUtil.js")
const mongoose = require("mongoose")
const auth = require("../config/firebase.js")
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth")
const admin = require("firebase-admin")
const User = require("../model/usersModel.js")

const signup = async (req, res, next) => {
  try {
    const user = req.body

    const isExist = await userIsExist(user.email)

    if (isExist) {
      throw new ErrorException(400, "Account is exist!")
    }

    const { secret, otp } = generateOTP()

    await client.set(user.email, JSON.stringify(secret), { EX: 15 * 60 })
    await sendMail("kiett5153@gmail.com", otp)

    return res.json({ data: user })
  } catch (error) {
    next(error)
  }
}

const authOTP = async (req, res, next) => {
  try {
    const { user, otp } = req.body
    const originalPassword = user.password
    const secret = await client.get(user.email)

    const otpNumber = Number(otp.join(''))

    const state = verifyOTP(JSON.parse(secret), otpNumber)

    if (!state) {
      throw new ErrorException(400, "OTP is invalid! Please try again!")
    }

    const hashedPassword = await hashPassword(user.password)

    if (hashedPassword) {
      user.password = hashedPassword
    }

    if (user.role === undefined || user.role === '') {
      user.role = "customer"
    }

    const userCredential = await createUserWithEmailAndPassword(auth, user.email, originalPassword)
    user.firebaseID = userCredential.user.uid
    await createUser(user)
    await client.del(user.email)

    return res.json({ data: user.email, message: "Signin successful!" })
  } catch (error) {
    next(error)
  }
}

const addNewCustomer = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const admin = req.body
    const originalPassword = admin.password
    admin.role = 'admin'

    const hashedPassword = await hashPassword(admin.password)

    if (hashedPassword) admin.password = hashedPassword

    const userCredential = await createUserWithEmailAndPassword(auth, admin.email, originalPassword)
    admin.firebaseID = userCredential.user.uid
    await createUser(admin)
    console.log(admin)
    return res.json({ user: admin, message: "Signin successful!" })
  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    await session.endSession()
  }
}

const socialLogin = async (req, res, next) => {
  try {
    const { social } = req.params  // vd: "google.com"
    const { token } = req.body

    if (!social || !token) {
      throw new ErrorException(400, "Missing social or token")
    }

    const decodedToken = await admin.auth().verifyIdToken(token)
    const { email, uid } = decodedToken

    let userDB = await userIsExist(email)

    if (!userDB) {
      // chưa có user → tạo mới
      const newUser = new User({
        email,
        firebaseID: uid,
        providers: [social]
      })
      userDB = await createUser(newUser)
    } else {
      // đã có user → kiểm tra provider
      if (!userDB.providers.includes(social)) {
        throw new ErrorException(
          400,
          `This account was registered using ${userDB.providers.join(", ")}, please login via that method.`
        )
      }
    }

    // Set cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 3600 * 1000
    })

    return res.json({
      data: { role: userDB.role, name: userDB.name },
      message: `Signin successful via ${social}!`
    })
  } catch (error) {
    next(error)
  }
}

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body.user

    if (!email || !password) {
      throw new ErrorException(400, "Missing email or password")
    }

    const userDB = await userIsExist(email)
    if (!userDB) {
      throw new ErrorException(400, "Account does not exist")
    }

    if (!userDB.providers.includes("email/password")) {
      throw new ErrorException(400, `This account was registered using ${userDB.providers.join(", ")}. Please login via that method.`)
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    const idToken = await user.getIdToken(true)
    const { refreshToken } = user.stsTokenManager

    res.cookie("accessToken", idToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 3600 * 1000, // 1h
    })

    await saveRefreshToken(user.email, refreshToken)

    return res.json({ data: { role: userDB.role, name: userDB.name }, message: "Signin successful via Email/Password!" })
  } catch (error) {
    let message = "Login failed"
    let status = 400

    switch (error.code) {
      case "auth/user-not-found":
        message = "Account does not exist"
        break
      case "auth/wrong-password":
        message = "Wrong password"
        break
      case "auth/invalid-email":
        message = "Invalid email"
        break
      case "auth/invalid-credential":
        message = "Incorrect email or password"
        break
      case "auth/too-many-requests":
        message = "Too many failed attempts, please try again later"
        break
    }

    next(new ErrorException(status, message))
  }
}

const signout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken', { httpOnly: true, sameSite: 'none', secure: true })

    return res.status(200).json({ message: 'Signed out successfully' })
  } catch (error) {
    next(error)
  }
}

const getUser = async (req, res, next) => {
  try {
    const { user } = req

    const u = await findUserById(user._id)

    if (!u) throw new ErrorException(500, "User not found!")

    return res.json({ data: u })
  } catch (error) {
    next(error)
  }
}

const putUser = async (req, res, next) => {
  try {
    const { user } = req
    const { newUser } = req.body
    const objectId = new mongoose.Types.ObjectId(user._id)
    console.log(newUser)
    // const userUpdated = await updateUser(objectId, newUser)

    // if (userUpdated === null) {
    //   throw new ErrorException(400, "Error updating information!")
    // }

    // return res.json({ message: "Update successful!" })
  } catch (error) {
    next(error)
  }
}

const getFilterUsers = async (req, res, next) => {
  try {
    let { options, page } = req.query
    if (!page) page = 1

    const decodedOptions = JSON.parse(decodeURIComponent(options))

    const { users, totalPages } = await filterUsers(decodedOptions, page)

    if (!Array.isArray(users) || typeof totalPages !== 'number') throw new ErrorException(500, "Invalid product list")

    return res.json({ data: users, totalPages: totalPages })
  } catch (error) {
    next(error)
  }
}

const updateAccount = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const user = req.body

    const updatedUser = await updateUser(user._id, user)

    if (!updatedUser) throw new ErrorException(400, 'Update failed')

    await session.commitTransaction()
    return res.json({ data: updatedUser, message: "Update successful" })
  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    await session.endSession()
  }
}

const changePassword = async (req, res, next) => {
  try {
    const { user } = req
    const password = req.body

    await comparePassword(user.password, password.currentPasswor)

    const hashedPassword = await hashPassword(password.passwordConfirmed)

    await admin.auth().updateUser(user.firebaseID, { password: password.passwordConfirmed })

    const updatedUser = await updateUser(user._id, { password: hashedPassword })

    if (!updatedUser) throw new ErrorException(400, 'Update failed')

    res.json({ message: "Password updated successfully" })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  signup,
  authOTP,
  addNewCustomer,
  signin,
  socialLogin,
  getUser,
  putUser,
  getFilterUsers,
  updateAccount,
  signout,
  changePassword
}