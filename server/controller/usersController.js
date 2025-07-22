import { createUser, saveRefreshToken, userIsExist } from "../service/usersService.js"
import ErrorException from "../util/error.js"
import sendMail from "../util/mailUtl.js"
import { generateOTP, verifyOTP } from "../util/otpUtil.js"
import client from "../config/redis.js"
import { comparePassword, hashPassword } from "../util/passwordUtil.js"
import { generateToken } from "../util/tokenUtil.js"

export const signup = async (req, res, next) => {
    try {
        const { user } = req.body

        // const isExist = await userIsExist(user)

        // if(isExist) {
        //     throw new ErrorException(400, "Account is exist!")
        // }

        const { secret, otp } = generateOTP()
        await client.set(user.email, JSON.stringify(secret), { EX: 15 * 60 })
        sendMail("kiett5153@gmail.com", otp)
        console.log(otp)
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

        return res.json({ data: { email: isExist.email, name: isExist.name }, message: "Signin successful!"})
    } catch (error) {
        next(error)
    }
}