import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { httpErrorException } from 'src/app.exception';
import { config } from 'dotenv';
// import { UserService } from 'src/user/user.service';
import { RequestWithUser } from '../types/types'
import { MarketplaceService } from 'src/marketplace/marketplace.service';
import { UserService } from 'src/user/user.service';
import { Document, Types } from 'mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';

config();

const USER_ACCESS_JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }


    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<RequestWithUser>();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new httpErrorException('Invalid credentials, please sign in.', 401);
        }

        try {
            // Verify token using the user secret key
            const payload: any = jwt.verify(token, USER_ACCESS_JWT_SECRET);
            request.user = payload;

            const {
                payload: { id: userId },
            } = request.user as any;

            await this.isUserActive(userId);


        } catch (error) {
            throw new httpErrorException('Invalid credentials, please retry..', 401);
        }

        return true;
    }

    private extractTokenFromHeader(
        request: RequestWithUser,
    ): string | null {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return null;
        }

        const [bearer, token] = authHeader.split(' ');
        return bearer === 'Bearer' && token ? token : null;
    }

    private async isUserActive(userId: string): Promise<Document<unknown, {}, User> & User & {
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
        if (user.status === 'Banned') {
            throw new httpErrorException(
                'You have been banned.',
                HttpStatus.UNAUTHORIZED,
            );
        }
        return user;
    }
}
