const speakeasy = require('speakeasy')

const generateOTP = () => {
    const secret = speakeasy.generateSecret({ length: 20 })

    const otp = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32'
    })
    console.log(otp)
    return { secret: secret, otp: otp }
}

const verifyOTP = (secret, otp) => {
    return speakeasy.totp.verify({
        secret: secret.base32,
        encoding: 'base32',
        window: 1,
        token: otp
    })
}

module.exports = { generateOTP, verifyOTP }