import { Document, Types } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { httpErrorException } from 'src/app.exception';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { EmailTypeKey, User, UserActivityLog, UserActivityType, UserDocument, UserRegistrationStage } from 'src/Schema/user.schema';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { UserSigninDto, verifyCodeDto } from 'src/Schema/Dto/user.dto';
import * as jwt from 'jsonwebtoken';
import { MailGun } from 'src/Utils/Email/Mailgun/mailgun.config';


config();

const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET;


@Injectable()
export class UserService {
    private oauth2Client: OAuth2Client;
    private Mailgun: MailGun;
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel('UserActivityLog') private readonly userActivityLogModel: Model<UserActivityLog>,
        private configService: ConfigService,
    ) {
        this.oauth2Client = new OAuth2Client({
            clientId: this.configService.get<string>('GOOGLE_CLIENT_ID'),
        });
    }

    //Private Methods
    private async sendVerificationEmail(
        user: UserDocument,
        key: string,
        emailParams?: {}
    ): Promise<void> {
        // const verificationLink = `${process.env.BASE_URL}/user/verifyemail/${user._id}`;
        // const emailParams = {
        //     userName: user?.firstName ?? 'user',
        //     verificationLink,
        //     verificationCode: user.verificationCode,
        // };

        // const mailGun = new MailGun(
        //     'api',
        //     process.env.MAILGUN_API_KEY,
        //     process.env.MAILGUN_DOMAIN,
        // );

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
            expiresIn: '90d',
        });
    }

    private generateRefreshToken(payload: any): string {
        return jwt.sign({ payload }, refreshTokenSecret, { expiresIn: '5m' });
    }











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
        } else if (user.status === 'Banned') {
            throw new httpErrorException(
                'You have been banned.',
                HttpStatus.UNAUTHORIZED,
            );
        }
        else if (user.status === 'Inactive') {
            throw new httpErrorException(
                'You recently deleted your account, sign in to reactivate.',
                HttpStatus.UNAUTHORIZED,
            );
        }
        return user
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

        if (existingUser && existingUser.status === 'Inactive') {
            existingUser.password = hashedPassword;

            try {
                await this.sendVerificationEmail(existingUser, EmailTypeKey.passwordReset);
            } catch (error) {
                throw new httpErrorException(
                    // `Failed to send verification email: ${error.messsage}`,
                    `Failed to send verification email, please retry.`,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
            await existingUser.save();

            const id = existingUser._id;

            return { userid: id, email: user.email, stage: UserRegistrationStage.VERIFY_EMAIL };
        }

        const newUser = await this.userModel.create({
            ...user,
            password: hashedPassword,
            verificationCode: verificationCode,
            stage: UserRegistrationStage.VERIFY_EMAIL,
            status: 'Active',
        });

        try {
            await this.sendVerificationEmail(newUser, UserRegistrationStage.VERIFY_EMAIL);
        } catch (error) {
            throw new httpErrorException(
                // `Failed to send verification email: ${error.messsage}`,
                `Failed to send verification email, please retry.`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
        await newUser.save();

        const id = newUser._id;

        return { userid: id, email: user.email, stage: UserRegistrationStage.VERIFY_EMAIL };
    }


    public async verifyEmailVerificationCode(verifyCodeData: verifyCodeDto): Promise<any> {
        const email = verifyCodeData.email;
        const user = await this.userModel
            .findOne({ email: email })
            .exec();
        if (!user) {
            throw new HttpException('This user does not exist.', HttpStatus.NOT_FOUND);
        }
        if (user.verificationCode == verifyCodeData.verificationCode) {
            await this.updateUserProfile(user._id.toString(), { stage: UserRegistrationStage.VERIFY_PROFILE });
            await this.updateUserProfile(user._id.toString(), { status: 'Active' });
            return { userid: user._id, email: user.email, stage: UserRegistrationStage.VERIFY_PROFILE };
        } else {
            throw new HttpException(`Email verification failed, please retry.`, HttpStatus.BAD_REQUEST);
        }
    }

    async signin(user: UserSigninDto): Promise<{}> {
        const foundUser = await this.userModel
            .findOne({ email: user.email })
            .select(['firstName', 'lastName', 'email', 'profilePicture', 'gender', 'stage', 'sexuality',])
            .exec();

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


}