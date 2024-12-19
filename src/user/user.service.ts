import { Document, Types } from 'mongoose';
import { Injectable, HttpException, HttpStatus, forwardRef, Inject } from '@nestjs/common';
import { httpErrorException } from 'src/app.exception';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { User, UserActivityLog, UserDocument, Verification, } from 'src/schema/user.schema';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { changePasswordDto, UserSigninDto, verifyCodeDto } from 'src/schema/Dto/user.dto';
import * as jwt from 'jsonwebtoken';
import { MailGun } from 'src/utils/email/mailgun/mailgun.config';
import { EmailTypeKey, UserActivityType, UserRegistrationStage, VerificationReason } from 'src/utils/types/statics';
import { MarketplaceService } from 'src/marketplace/marketplace.service';


config();

const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET;


@Injectable()
export class UserService {
    private oauth2Client: OAuth2Client;
    private Mailgun: MailGun;
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(UserActivityLog.name) private readonly userActivityLogModel: Model<UserActivityLog>,
        private configService: ConfigService,
        @Inject(forwardRef(() => MarketplaceService))
        private MarketplaceService: MarketplaceService
    ) {
        this.oauth2Client = new OAuth2Client({
            clientId: this.configService.get<string>('GOOGLE_CLIENT_ID'),
        });
    }


    private createVerificationDetails(verificationCode: string, reason: VerificationReason): Verification {
        const verificationDetails: Verification = {
            verificationCode,
            reason,
            createdAt: new Date(),
        };

        return verificationDetails;
    }

    private async updateUserProfile(
        userId: string,
        updateData: { [key: string]: any },
    ): Promise<any> {
        const updatedProfile = await this.userModel.findOneAndUpdate(
            { _id: userId },
            { $set: updateData },
            { new: true },
        );

        return updatedProfile;
    }

    private generateAccessToken(payload: any): string {
        return jwt.sign({ payload }, accessTokenSecret, {
            expiresIn: '1d',
        });
    }

    private generateRefreshToken(payload: any): string {
        return jwt.sign({ payload }, refreshTokenSecret, { expiresIn: '5m' });
    }

    private isTimeValid(referenceDate: Date, quantity: number, unit: string) {
        const currentTime = new Date().getTime();
        const verificationCodeTimestamp = new Date(referenceDate).getTime();

        let expirationTime: number;

        switch (unit) {
            case 's': // seconds
                expirationTime = quantity * 1000;
                break;
            case 'm': // minutes
                expirationTime = quantity * 60 * 1000;
                break;
            case 'hr': // hours
                expirationTime = quantity * 60 * 60 * 1000;
                break;
            default:
                throw new Error("Invalid unit. Use 's' for seconds, 'm' for minutes, or 'hr' for hours.");
        }

        // Check if the time difference exceeds the expiration time
        const hasExpired = currentTime - verificationCodeTimestamp > expirationTime;
        if (hasExpired) {
            throw new httpErrorException(
                'This link or code has expired.',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    private isBanned(user: UserDocument): void {
        if (user.status === 'Banned') {
            throw new httpErrorException(
                'You have been banned.',
                HttpStatus.UNAUTHORIZED,
            );
        }
    }

    private async authenticatedUser(arg: { email?: string, userId?: string }): Promise<Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }> {
        const { userId, email } = arg;
        if (email) {
            const user = await this.userModel
                .findOne({ email: email })
                .select(['firstName', 'lastName', 'email', 'profilePicture', 'gender', 'stage', 'sexuality',])
                .exec();
            if (!user) {
                throw new httpErrorException(
                    `This user doesn't exist.`,
                    HttpStatus.UNAUTHORIZED,
                );
            }
            return user
        }

        if (!userId) {
            const user = await this.userModel
                .findOne({ _id: userId })
                .select(['firstName', 'lastName', 'email', 'profilePicture', 'gender', 'stage', 'sexuality',])
                .exec();
            if (!user) {
                throw new httpErrorException(
                    `This user doesn't exist.`,
                    HttpStatus.UNAUTHORIZED,
                );
            }
            return user
        }
    }




    // PUBLIC METHODS

    public async isUserActive(userId: string): Promise<Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }> {
        const user = await this.userModel
            .findById(userId)
            .exec();

        if (!user) {
            throw new httpErrorException(
                'This user does not exist, please sign up.',
                HttpStatus.NOT_FOUND,
            );
        }
        else if (user.status === 'Inactive') {
            throw new httpErrorException(
                'You recently deleted your account, sign in to reactivate.',
                HttpStatus.UNAUTHORIZED,
            );
        }
        this.isBanned(user);
        return user;
    }

    public async logUserActivity(activityType: UserActivityType, params: any = {}, userId?: string, isGuest?: boolean): Promise<any> {
        const newLog = new this.userActivityLogModel({
            userId: userId ?? 'Guest',
            activityType,
            isGuest: isGuest ?? false,
            params,
        });

        await newLog.save();
        return newLog;
    }





    // ROUTES

    public async signup(user: UserSigninDto): Promise<{}> {
        const existingUser = await this.userModel
            .findOne({ email: user.email })
            .exec();

        if (existingUser && existingUser.status == 'Active') {
            throw new httpErrorException(
                'User with this email already exist, please sign in.',
                HttpStatus.CONFLICT,
            );
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const verificationCode = Math.floor(
            10000 + Math.random() * 90000,
        ).toString();
        const verificationDetails = this.createVerificationDetails(verificationCode, VerificationReason.VERIFY_EMAIL)

        if (existingUser && existingUser.status === 'Inactive') {
            existingUser.password = hashedPassword;

            try {
                const emailParams = {
                    name: existingUser.firstName,
                    verificationCode: verificationCode,
                };
                await this.Mailgun.sendEmail(existingUser.email, EmailTypeKey.verifyEmail, emailParams);
                await this.updateUserProfile(existingUser._id.toString(), { verificationDetails: verificationDetails })
            } catch (error) {
                throw new httpErrorException(
                    // `Failed to send verification email: ${error.messsage}`,
                    `Failed to send verification code to your email, please retry.`,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
            await existingUser.save();

            const id = existingUser._id;
            await this.updateUserProfile(existingUser._id.toString(), { stage: UserRegistrationStage.VERIFY_EMAIL, })
            return { userid: id, email: user.email, stage: UserRegistrationStage.VERIFY_EMAIL };
        }


        const newUser = await this.userModel.create({
            ...user,
            password: hashedPassword,
            stage: UserRegistrationStage.VERIFY_EMAIL,
            status: 'Active',
        });

        try {
            const emailParams = {
                name: existingUser.firstName,
                verificationCode: verificationCode,
            };
            await this.Mailgun.sendEmail(newUser.email, EmailTypeKey.verifyEmail, emailParams);
            await this.updateUserProfile(newUser._id.toString(), { verificationDetails: verificationDetails })
        } catch (error) {
            throw new httpErrorException(
                // `Failed to send verification email: ${error.messsage}`,
                `Failed to send verification email, please retry.`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
        await newUser.save();

        const id = newUser._id;

        return { email: user.email, stage: UserRegistrationStage.VERIFY_EMAIL };
    }


    public async verifyEmailVerificationCode(verifyCodeData: verifyCodeDto): Promise<any> {
        const email = verifyCodeData.email;
        const user = await this.authenticatedUser({ email });
        if (!user) {
            throw new HttpException('This user does not exist.', HttpStatus.NOT_FOUND);
        }
        this.isBanned(user);
        if (user.verificationDetails.reason != VerificationReason.VERIFY_EMAIL) {
            throw new HttpException('This is on us, please, resend code.', HttpStatus.NOT_FOUND);
        }

        this.isTimeValid(user.verificationDetails.createdAt, 10, 'm');

        if (user.verificationDetails.verificationCode === verifyCodeData.verificationCode) {
            await this.updateUserProfile(user._id.toString(), { stage: user.status === "Inactive" ? user.stage : UserRegistrationStage.VERIFY_PROFILE });
            await this.updateUserProfile(user._id.toString(), { status: 'Active' });
            const accessToken = this.generateAccessToken(user._id);
            const refreshToken = this.generateRefreshToken(user._id);
            return { accessToken, refreshToken, user };
        } else {
            throw new HttpException(`Email verification failed, please retry.`, HttpStatus.BAD_REQUEST);
        }
    }

    async signin(user: UserSigninDto): Promise<{}> {
        const foundUser = await this.authenticatedUser({ email: user.email })

        if (!foundUser) {
            throw new HttpException(
                'Invalid email or password.',
                HttpStatus.UNAUTHORIZED,
            );
        }

        const isPasswordValid = await bcrypt.compare(
            user.password,
            foundUser.password,
        );

        if (!isPasswordValid) {
            throw new HttpException(
                'Invalid email or password',
                HttpStatus.UNAUTHORIZED,
            );
        }

        this.isBanned(foundUser);
        if (foundUser.status === 'Inactive') {
            try {
                const verificationCode = Math.floor(
                    10000 + Math.random() * 90000,
                ).toString();
                const verificationDetails = this.createVerificationDetails(verificationCode, VerificationReason.VERIFY_EMAIL)
                const emailParams = {
                    name: foundUser.firstName,
                    verificationCode: verificationCode,
                };
                await this.Mailgun.sendEmail(foundUser.email, EmailTypeKey.verifyEmail, emailParams);
                await this.updateUserProfile(foundUser._id.toString(), { verificationDetails: verificationDetails })
            } catch (error) {
                throw new httpErrorException(
                    // `Failed to send verification email: ${error.messsage}`,
                    `Failed to send verification email, please retry.`,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
            return { userid: foundUser._id.toString(), email: user.email, stage: UserRegistrationStage.VERIFY_EMAIL };
        }

        const accessToken = this.generateAccessToken(foundUser._id);
        const refreshToken = this.generateRefreshToken(foundUser._id);
        const id = foundUser._id.toString();
        await this.logUserActivity(UserActivityType.LOGIN, { email: user.email }, id,)
        return {
            accessToken,
            refreshToken,
            user: foundUser,
        };
    }

    public async passwordReset(
        changePasswordDto: changePasswordDto,
    ): Promise<any> {
        const { email, verificationCode, oldPassword, newPassword } = changePasswordDto
        const user = await this.authenticatedUser({ email });
        await this.isUserActive(user._id.toString());
        if (user.verificationDetails.reason != VerificationReason.PASSSWORD_RESET) {
            throw new HttpException('This is on us, please retry the process.', HttpStatus.NOT_FOUND);
        }
        const isPasswordValid = await bcrypt.compare(
            oldPassword,
            user.password,
        );

        if (!isPasswordValid) {
            throw new HttpException(
                'Invalid old password.',
                HttpStatus.UNAUTHORIZED,
            );
        }

        this.isTimeValid(user.verificationDetails.createdAt, 10, 'm');

        if (verificationCode != user.verificationDetails.verificationCode) {
            throw new HttpException(
                'Invalid verification code, cannot complete the process.',
                HttpStatus.BAD_REQUEST,
            );
        }

        const newHashedPassword = await bcrypt.hash(
            newPassword,
            10,
        );

        user.password = newHashedPassword;
        await user.save();
        await this.logUserActivity(UserActivityType.PASSWORD_RESET, { oldPassword: oldPassword, newPassword: newPassword }, user._id.toString())
        const accessToken = this.generateAccessToken(user._id);
        const refreshToken = this.generateRefreshToken(user._id);
        return {
            accessToken,
            refreshToken,
            user: user,
        };
    }


    async resendEmailVerificationCode(email: string): Promise<string> {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            throw new HttpException('This user does not exist, please sign up.', HttpStatus.NOT_FOUND);
        }

        try {
            const verificationCode = Math.floor(
                10000 + Math.random() * 90000,
            ).toString();
            const verificationDetails = this.createVerificationDetails(verificationCode, VerificationReason.VERIFY_EMAIL)
            const emailParams = {
                name: user.firstName,
                verificationCode: verificationCode,
            };
            await this.Mailgun.sendEmail(user.email, EmailTypeKey.verifyEmail, emailParams);
            await this.updateUserProfile(user._id.toString(), { verificationDetails: verificationDetails });
            return 'Email verification code sent successfully.'
        } catch (error) {
            throw new httpErrorException(
                // `Failed to send verification email: ${error.messsage}`,
                `Failed to send verification email, please retry.`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async forgotPassword(email: string): Promise<string> {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            throw new HttpException('This user does not exist, please sign up.', HttpStatus.NOT_FOUND);
        }
        this.isBanned(user);
        try {
            const verificationCode = Math.floor(
                10000 + Math.random() * 90000,
            ).toString();
            const verificationDetails = this.createVerificationDetails(verificationCode, VerificationReason.PASSSWORD_RESET)
            const resetUrl = `${process.env.FRONTEND_BASE_URL}/resetpassword/${user._id}`;
            const emailParams = {
                name: user.firstName,
                verificationCode: verificationCode,
                resetUrl: resetUrl
            };
            await this.Mailgun.sendEmail(user.email, EmailTypeKey.passwordReset, emailParams);
            await this.updateUserProfile(user._id.toString(), { verificationDetails: verificationDetails });
            return 'Password reset email sent successfully.'
        } catch (error) {
            throw new httpErrorException(
                // `Failed to send verification email: ${error.messsage}`,
                `Failed to send verification email, please retry.`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}