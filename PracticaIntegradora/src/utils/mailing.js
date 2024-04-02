import mailer from 'nodemailer'
import { getVariables } from '../config/config.js'
import { Command } from 'commander'

export default class MailingService {
  constructor(){
    const program = new Command()
    program.option('--mode <mode>', 'Modo de trabajo', 'production')
    const options = program.parse()
    const { mailing } = getVariables(options)

    this.client= mailer.createTransport({
        service: mailing.SERVICE,
        port: 587,
        auth:{
          user: mailing.USER,
          pass: mailing.PASSWORD
        }
      }
    )
  }

  sendMail = async ({from, to, subject, html, attachments=[]}) => {
      const result= await this.client.sendMail({from, to, subject, html, attachments})
      return result
  }
}