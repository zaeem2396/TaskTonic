import nodeMailer from 'nodemailer'

class MailerServices {
    private transporter: nodeMailer.Transporter

    constructor() {
        this.transporter = nodeMailer.createTransport({
            host: 'mailhog',
            port: 1025,
            secure: false,
            ignoreTLS: true
        })
    }


    async sendMail(from: string, to: string, subject: string, message: any) {
        try {
            const mailOption = {
                from: from,
                to: to,
                subject: subject,
                html: message
            }

            const info = await this.transporter.sendMail(mailOption)
            console.log(`Email sent: ${info}`);
        } catch (error: any) {
            console.log(`Error sending mail: ${error}`);
        }
    }
}

export default MailerServices