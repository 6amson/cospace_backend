import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { httpErrorException } from 'src/app.exception';
import { config } from 'dotenv';
import { UserService } from 'src/user/user.service';
import { RequestWithUser } from '../Types/types'

config();

const USER_ACCESS_JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly userService: UserService) { }

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

            await this.userService.isUserActive(userId);
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
}
