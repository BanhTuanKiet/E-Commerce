import { createUser, findUserById, saveRefreshToken, userIsExist, updateUser } from "../service/usersService.js"
import ErrorException from "../util/error.js"
import { sendMail } from "../util/mailUtl.js"
import { generateOTP, verifyOTP } from "../util/otpUtil.js"
import client from "../config/redis.js"
import { comparePassword, hashPassword } from "../util/passwordUtil.js"
import { generateToken } from "../util/tokenUtil.js"
import mongoose from "mongoose"

export const signup = async (req, res, next) => {
  try {
    const { user } = req.body

    const isExist = await userIsExist(user)

    if (isExist) {
      throw new ErrorException(400, "Account is exist!")
    }

    const { secret, otp } = generateOTP()

    await client.set(user.email, JSON.stringify(secret), { EX: 15 * 60 })
    sendMail("kiett5153@gmail.com", otp)

    return res.json({ data: user })
  } catch (error) {
    next(error)
  }
}

export const authOTP = async (req, res, next) => {
  try {
    const { user, otp } = req.body
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

    if (user.role === undefined) {
      user.role = "customer"
    }

    await createUser(user)

    return res.json({ data: user.email, message: "Signin successful!" })
  } catch (error) {
    next(error)
  }
}

export const signin = async (req, res, next) => {
  try {
    const { user } = req.body

    const isExist = await userIsExist(user)

    if (!isExist) {
      throw new ErrorException(400, "Account is not exist! Please try again!")
    }

    const isMatch = await comparePassword(user.password, isExist.password)

    if (!isMatch) {
      throw new ErrorException(400, "Wrong password! Please try again!")
    }

    const accessToken = generateToken(isExist._id, isExist.role, '1h')
    const refreshToken = generateToken(isExist._id, isExist.role, '8h')

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      maxAge: 3600 * 8 * 1000,
      secure: true
    })

    await saveRefreshToken(isExist.email, refreshToken)

    return res.json({ data: { role: isExist.role, name: isExist.name }, message: "Signin successful!" })
  } catch (error) {
    next(error)
  }
}

export const getUser = async (req, res, next) => {
  try {
    const { user } = req

    const u = await findUserById(user._id)

    if (!u) throw new ErrorException(500, "User not found!")

    return res.json({ data: u })
  } catch (error) {
    next(error)
  }
}

export const putUser = async (req, res, next) => {
  try {
    const { user } = req
    const { newUser } = req.body
    const objectId = new mongoose.Types.ObjectId(user._id)

    const userUpdated = await updateUser(objectId, newUser)

    if (userUpdated === null) {
      throw new ErrorException(400, "Error updating information!")
    }

    return res.json({ message: "Update successful!" })
  } catch (error) {
    console.log(error)
  }
}