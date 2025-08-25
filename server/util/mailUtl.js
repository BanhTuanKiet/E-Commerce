const transporter = require('../config/mail')

const sendMail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verification Code",
    html: `
      <p>Hi <strong>[User's Name]</strong>,</p>
      <p>Use the code below to verify your account:</p>
      <p style="font-size: 20px; font-weight: bold; color: #d32f2f;">${otp}</p>
      <p>This code expires in <strong>60 seconds</strong>. If you didn’t request this, please ignore this email.</p>
      <p>Best,<br /><strong>[Company Name]</strong></p>
    `
  }

  transporter.sendMail(mailOptions, (err) => {
    if (err) console.log('Send mail error:', err)
  })
}

const sendMailUpdateOrderStatus = async (email, status) => {
  const orderStatusMailContent = {
    processing: { subject: 'Your order is being processed', html: `<p>We have received your order and it is currently being processed.</p>` },
    confirmed: { subject: 'Your order has been confirmed', html: `<p>Your order has been confirmed and will be shipped shortly.</p>` },
    shipping: { subject: 'Your order is on the way', html: `<p>Your order has been shipped and is on its way to you.</p>` },
    delivered: { subject: 'Your order has been delivered', html: `<p>Your order has been successfully delivered. Thank you for shopping with us!</p>` },
    cancelled: { subject: 'Your order has been cancelled', html: `<p>Unfortunately, your order has been cancelled. If you have any questions, feel free to contact us.</p>` },
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: orderStatusMailContent[status].subject,
    html: orderStatusMailContent[status].html
  }

  transporter.sendMail(mailOptions, (err) => {
    if (err) console.log('Send mail error:', err)
  })
}

module.exports = { sendMail, sendMailUpdateOrderStatus }
