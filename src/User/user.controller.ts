import { JwtAuthGuard } from 'src/Utils/Guard/user.guard';
import { RequestWithUser } from 'src/Utils/Types/types';
import {
    Controller,
    Post,
    Get,
    Req,
    UseGuards,
    Body,
    Res,
    HttpStatus,
    Query,
    Param,
    HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { changePasswordDto, UserSigninDto, verifyCodeDto } from 'src/Schema/Dto/user.dto';
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('profile/:userId')
    getUserProfile(@Req() req: RequestWithUser,) {
        const {
            payload: { id: userId },
        } = req.user as any;
    }

    @Post('signup')
    async signup(@Res() response: Response, @Body() user: UserSigninDto) {
        const newUser = await this.userService.signup(user);
        return response.status(HttpStatus.CREATED).json({ ...newUser });
    }

    @Post('verify-email')
    async verifyEmailVerificationCode(
        @Res() response: Response,
        @Body() verifyCodeData: verifyCodeDto,
    ) {
        const result = await this.userService.verifyEmailVerificationCode(
            verifyCodeData,
        );
        return response.status(HttpStatus.OK).json(result);
    }

    @Post('signin')
    async signin(@Res() response: Response, @Body() user: UserSigninDto) {
        const loggedInUser = await this.userService.signin(user);
        return response.status(HttpStatus.OK).json(loggedInUser);
    }

    @Post('password-reset')
    async passwordReset(
        @Res() response: Response,
        @Body() changePasswordDto: changePasswordDto,
    ) {
        const result = await this.userService.passwordReset(changePasswordDto);
        return response.status(HttpStatus.OK).json(result);
    }

    @Post('resend-verification')
    async resendEmailVerificationCode(
        @Res() response: Response,
        @Body('email') email: string,
    ) {
        const result = await this.userService.resendEmailVerificationCode(email);
        return response.status(HttpStatus.OK).json({ message: result });
    }

    @Post('forgot-password')
    async forgotPassword(
        @Res() response: Response,
        @Body('email') email: string,
    ) {
        const result = await this.userService.forgotPassword(email);
        return response.status(HttpStatus.OK).json({ message: result });
    }
}
