import mail from '../config/mail.js'

export const sendMail = async (email, otp) => {
  const transporter = mail

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verificatione Code",
    html:
      `<p>Hi <strong>[User's Name]</strong>,</p>
            <p>Use the code below to verify your account:</p>
            <p style="font-size: 20px; font-weight: bold; color: #d32f2f;">${otp}</p>
            <p>This code expires in <strong>60 seconds</strong>. If you didn’t request this, please ignore this email.</p>
            <p>Best,<br />
            <strong>[Company Name]</strong></p>`
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('Send mail error:', err)
    }
  })
}

export const sendMailUpdateOrderStatus = async (email, status) => {
  const orderStatusMailContent = {
    processing: {
      subject: 'Your order is being processed',
      html: `
      <p>Dear customer,</p>
      <p>We have received your order and it is currently being processed.</p>
      <p>We will notify you once it has been confirmed.</p>
      <p>Best regards,</p>
      <p>Your Store Team</p>
    `,
    },
    confirmed: {
      subject: 'Your order has been confirmed',
      html: `
      <p>Dear customer,</p>
      <p>Your order has been confirmed and will be shipped shortly.</p>
      <p>We will update you once it is on the way.</p>
      <p>Best regards,</p>
      <p>Your Store Team</p>
    `,
    },
    shipping: {
      subject: 'Your order is on the way',
      html: `
      <p>Dear customer,</p>
      <p>Your order has been shipped and is on its way to you.</p>
      <p>Please keep your phone available for delivery updates.</p>
      <p>Best regards,</p>
      <p>Your Store Team</p>
    `,
    },
    delivered: {
      subject: 'Your order has been delivered',
      html: `
      <p>Dear customer,</p>
      <p>Your order has been successfully delivered. Thank you for shopping with us!</p>
      <p>We hope to serve you again soon.</p>
      <p>Best regards,</p>
      <p>Your Store Team</p>
    `,
    },
    cancelled: {
      subject: 'Your order has been cancelled',
      html: `
      <p>Dear customer,</p>
      <p>Unfortunately, your order has been cancelled. If you have any questions, feel free to contact us.</p>
      <p>Best regards,</p>
      <p>Your Store Team</p>
    `,
    },
  }

  const transporter = mail

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: orderStatusMailContent[status].subject,
    html: orderStatusMailContent[status].html
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('Send mail error:', err)
    }
  })
}