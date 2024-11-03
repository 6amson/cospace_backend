import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/Utils/Guard/user.guard';
import { RequestWithUser } from 'src/Utils/Types/types';

@Controller('user')
export class UserController {
    @UseGuards(JwtAuthGuard)
    @Get('profile/:userId')
    getUserProfile(@Req() req: RequestWithUser,) {
        const {
            payload: { id: userId },
        } = req.user as any;
    }
}
