const { VNPay, ignoreLogger } = require('vnpay')

const configVNPay = new VNPay({
    vnp_TmnCode: process.env.VNP_TMNCODE,
    vnp_HashSecret: process.env.VNP_HASHSECRET,
    // vnpayHost: 'https://sandbox.vnpayment.vn',
    vnp_Url: process.env.VNP_URL,
    vnp_ReturnUrl: process.env.VNP_RETURNURL,
    testMode: true,
    hashAlgorithm: 'SHA512', 
    enableLog: true,
    loggerFn: ignoreLogger,
})

module.exports = configVNPay