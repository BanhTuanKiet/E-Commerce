import nodemailer from 'nodemailer'

const sendMail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

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

export default sendMail