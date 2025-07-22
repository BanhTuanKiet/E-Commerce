import users from "../model/usersModel.js"

export const createUser = async (user) => {
    return await users.create(JSON.parse(JSON.stringify(user)))
}

export const userIsExist = async (user) => {
    return await users.findOne({ email: user.email })
}

export const saveSecretKey = async (email, otpSecret) => {
    return await users.updateOne(
        { email: email },
        { $set: { otpSecret: otpSecret } }
    )
}

export const saveRefreshToken = async (email, refreshToken) => {
    return await users.updateOne(
        { email: email },
        { refreshToken: refreshToken }
    )
}

export const getRefreshToken = async (_id) => {
    return await users.findById(_id).select('refreshToken')
}