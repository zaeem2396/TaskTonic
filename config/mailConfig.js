const nodeMailer = require('nodemailer')

const transportor = nodeMailer.createTransport({
    host: 'mailhog',
    port: 1025,
    secure: false,
    ignoreTLS: true
})

async function sendMail(message) {
    const mailOption = {
        from: 'no-reply@tasktonic.com',
        to: 'system@tasktonic.com',
        subject: 'Test Mail',
        html: message
    }

    try {
        const info = await transportor.sendMail(mailOption)
        console.log(`Email sent: ${info}`);
    } catch (error) {
        console.log(`Something went wrong: ${error}`);
    }
}

module.exports = { transportor, sendMail }