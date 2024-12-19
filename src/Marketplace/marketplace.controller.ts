import { JwtAuthGuard } from 'src/Utils/Guard/user.guard.service';
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
import { Response } from 'express';
import { changePasswordDto, UserSigninDto, verifyCodeDto } from 'src/Schema/Dto/user.dto';


@Controller('marketplace')
export class MarketplaceController {

}