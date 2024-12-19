import { Document, Types } from 'mongoose';
import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { httpErrorException } from 'src/app.exception';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { User, UserActivityLog, UserComplaint, UserDocument, UserReview, Verification, } from 'src/Schema/user.schema';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { changePasswordDto, UserSigninDto, verifyCodeDto } from 'src/Schema/Dto/user.dto';
import * as jwt from 'jsonwebtoken';
import { MailGun } from 'src/Utils/Email/Mailgun/mailgun.config';
import { EmailTypeKey, UserActivityType, UserRegistrationStage, VerificationReason } from 'src/Utils/Types/statics';
import { UserService } from 'src/user/user.service';


config();

const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET;


@Injectable()
export class MarketplaceService {
    private oauth2Client: OAuth2Client;
    private Mailgun: MailGun;
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(UserActivityLog.name) private readonly userActivityLogModel: Model<UserActivityLog>, // Use .name
        @InjectModel(UserReview.name) private readonly userReview: Model<UserReview>, // Use .name
        @InjectModel(UserComplaint.name) private readonly userComplaint: Model<UserComplaint>,
        private configService: ConfigService,
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    ) {
        this.oauth2Client = new OAuth2Client({
            clientId: this.configService.get<string>('GOOGLE_CLIENT_ID'),
        });
    }

}