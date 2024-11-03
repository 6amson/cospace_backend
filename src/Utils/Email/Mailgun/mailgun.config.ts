import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import { getEmailTemplate } from '../emailTemplates/email.template';
import { config } from 'dotenv';

config();

const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_USERNAME = 'api';

export class MailGun {
    private mg;
    constructor() {
        this.mg = new Mailgun(FormData).client({
            username: MAILGUN_USERNAME,
            key: MAILGUN_API_KEY,
        });
    }

    private async sendEmailPro(to: string, key: string, params: any = {}, buffer?: Buffer) {
        const data = {
            from: 'Cospace',
            to,
            subject: getEmailTemplate(key, params).subject,
            text: getEmailTemplate(key, params).text,
            html: getEmailTemplate(key, params).html,
            attachment: buffer,
        };

        await this.mg.messages
            .create(MAILGUN_DOMAIN, data)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    public async sendEmail(to: string, key: string, params: any = {}, buffer?: Buffer) {
        this.sendEmailPro(to, key, params, buffer);
    }

    public async sendBulkEmail(
        recipients: string[],
        key: string,
        params: any = {},
        buffer?: Buffer,
    ) {
        const promises = recipients.map((to) =>
            this.sendEmail(to, key, params, buffer),
        );
        return Promise.all(promises);
    }
}
