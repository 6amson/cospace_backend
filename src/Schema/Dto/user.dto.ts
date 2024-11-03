import { PartialType } from '@nestjs/mapped-types';
import {
    IsString,
    IsNotEmpty,
    IsEmail,
    IsOptional,
    IsBoolean,
    IsUrl,
    IsDate,
    MinLength,
    IsMongoId,
    Min,
    Max,
    Matches,
    IsNumber,
    IsEnum,
    IsObject,
    ValidateNested,
    Length,
    IsArray,
} from 'class-validator';



export class UserSigninDto {
    @IsEmail({}, { message: 'Email format invalid' })
    @IsNotEmpty({ message: 'Email is required' })
    readonly email: string;

    @IsNotEmpty({ message: 'Password is required' })
    readonly password: string;

    @IsNotEmpty({ message: 'First name is required' })
    readonly firstName: string;

    @IsNotEmpty({ message: 'Last name is required' })
    readonly lastName: string;
}

export class verifyCodeDto {
    @IsEmail({}, { message: 'Email format invalid' })
    @IsNotEmpty()
    email: string;

    @IsNotEmpty({ message: 'Verification code is required' })
    @IsString()
    verificationCode: string;
}

export class resetPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    oldPassword: string;

    @IsNotEmpty()
    @IsString()
    newPassword: string;
}