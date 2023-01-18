const nodemailer = require('nodemailer');

class MailService {

  constructor() {
      this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: false,
          auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD
          }
      })
  }

  async sendEmail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Kontoaktivering' + process.env.API_URL,
      text: '',
      html: 
          `
            <div>
              <h1>Trykk på lenken for aktivering</h1>
              <a href="${link}">${link}</a>
            </div>
          `
    })
  }
};

module.exports = new MailService()