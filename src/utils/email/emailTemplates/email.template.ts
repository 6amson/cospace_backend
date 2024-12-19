/* eslint-disable prettier/prettier */
import { EmailTypeKey } from 'src/utils/types/statics';
import { getEmailHeader, getEmailLayout } from './emailLayouts/emailLayouts/email.layout'

export type EmailTemplate = {
    subject: string;
    text: string;
    html: string;
};

export const getEmailTemplate = (
    key: string,
    params: any = {},
): EmailTemplate => {
    switch (key) {
        case EmailTypeKey.verifyEmail:
            const verifyEmailHeader = getEmailHeader(params.name);
            const verifyEmailBody = `
          <div class="credentials">
            <p>You're almost there! Please verify your email address.</p>
            <p><strong>Verification Code</strong></p>
            <p>${params.verificationCode}<p>
         </div>
    `;
            const verifyEmailHtml = getEmailLayout(
                verifyEmailHeader,
                'Email Verification',
                verifyEmailBody,
            );

            return {
                subject: 'Email Verification',
                text: `Welcome to Cospace!`,
                html: verifyEmailHtml,
            };

        case EmailTypeKey.resendEmailVerificationCode:
            const resendVerificationCodeHeader = getEmailHeader(params.name);
            const resendVerificationCodeBody = `
          <div class="credentials">
            <p>Please, verify your email address.</p>
            <p><strong>Verification Code</strong></p>
            <p>${params.verificationCode}<p>
         </div>
    `;
            const resendVerificationCodeHtml = getEmailLayout(
                resendVerificationCodeHeader,
                'Email Verification',
                resendVerificationCodeBody,
            );

            return {
                subject: 'Email Verification',
                text: `You requested a new verification code.`,
                html: resendVerificationCodeHtml,
            };

        case EmailTypeKey.passwordReset:
            const resetHeader = getEmailHeader(params.name);
            const resetDetailBody = `
                  <div class="credentials">
                    <p> Copy the verification code below and click the link to reset your password:</p>
                    <p><strong>Verification Code<strong/></p>
                    <p>${params.verificationCode}</p>
                    <p><a href="${params.resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #5D3FD3; color: #ffffff; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
                    <p>If you did not request a password reset, please ignore this email.</p>
                  </div>
                `;
            const resetHtml = getEmailLayout(
                resetHeader,
                'Password Reset Request',
                resetDetailBody,
            );

            return {
                subject: 'Password Reset Request.',
                text: `You have requested a password reset.`,
                html: resetHtml,
            };

        case EmailTypeKey.listingSuccess:
            const listingSuccessHeader = getEmailHeader(params.name);
            const listingSuccessDetailBody = `
                      <div class="credentials">
                        
                      </div>
                    `;
            const listingSuccessHtml = getEmailLayout(
                listingSuccessHeader,
                'Your listing is live!',
                listingSuccessDetailBody,
            );

            return {
                subject: 'Listing success 🎉.',
                text: `Your listing has been successfully uploaded.`,
                html: listingSuccessHtml,
            };

        case EmailTypeKey.listingDelisted:
            const listingDelistedHeader = getEmailHeader(params.name);
            const listingDelistedDetailBody = `
                          <div class="credentials">
                            
                          </div>
                        `;
            const listingDelistedHtml = getEmailLayout(
                listingDelistedHeader,
                'Your listing has been delisted.',
                listingDelistedDetailBody,
            );

            return {
                subject: 'Listing Delisted.',
                text: `Your ${params.listingType} listing has been delisted.`,
                html: listingDelistedHtml,
            };
    }
}


