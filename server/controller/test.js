const vnpayPayment = async (req, res, next) => {
  try {
    const dateFormat = (await import('dateformat')).default
    // const vnp_IpnUrl = "http://localhost:3000/order/auth/vnpay_ipn"

    const tmnCode = vnpay.globalDefaultConfig.vnp_TmnCode
    const secretKey = vnpay.globalDefaultConfig.vnp_HashSecret

    var vnpUrl = vnpay.globalDefaultConfig.vnp_Url
    const returnUrl = vnpay.globalDefaultConfig.vnp_ReturnUrl

    const date = new Date()

    const createDate = dateFormat(date, 'yyyymmddHHMMss')
    const orderId = req.body.orderId
    const amount = req.body.totalAmount
    // var bankCode = req.body.bankCode
    const ipAddr = '127.0.0.1'
    const orderInfo = "Thanh+toan+don+hang+" + req.body.orderDescription || ''
    const orderType = req.body.orderType || 'other'
    const locale = req.body.language || 'vn'
    const currCode = 'VND'
    const order = req.body.order || ""
    const quantities = req.body.quantities || 1
    var vnp_Params = {}
    vnp_Params['vnp_Version'] = '2.1.0'
    vnp_Params['vnp_Command'] = 'pay'
    vnp_Params['vnp_TmnCode'] = tmnCode
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale
    vnp_Params['vnp_CurrCode'] = currCode
    vnp_Params['vnp_TxnRef'] = orderId
    vnp_Params['vnp_OrderInfo'] = orderInfo
    vnp_Params['vnp_OrderType'] = orderType
    vnp_Params['vnp_Amount'] = amount * 100 * 1000
    vnp_Params['vnp_ReturnUrl'] = returnUrl
    vnp_Params['vnp_IpAddr'] = ipAddr
    vnp_Params['vnp_CreateDate'] = createDate
    // vnp_Params['vnp_order'] = order
    // vnp_Params['vnp_quantities'] = quantities
    // vnp_Params['vnp_IpnUrl'] = vnp_IpnUrl
    // if(bankCode !== null && bankCode !== ''){
    //     vnp_Params['vnp_BankCode'] = bankCode
    // }

    vnp_Params = Object.fromEntries(Object.entries(vnp_Params).sort())

    const signData = querystring.stringify(vnp_Params)
    const hmac = crypto.createHmac('sha512', secretKey)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
    vnp_Params['vnp_SecureHash'] = signed
    vnpUrl += '?' + querystring.stringify(vnp_Params)

    return res.json({ vnpUrl: vnpUrl })
  } catch (error) {
    next(error)
  }
}