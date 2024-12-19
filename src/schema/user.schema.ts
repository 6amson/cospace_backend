import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsArray,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HydratedDocument, Document, Types } from 'mongoose';
import { ComplaintsType, Gender, matchStatus, Sexuality, UserActivityType, UserRegistrationStage, UserStatus, VerificationReason } from 'src/utils/types/statics';

export type UserDocument = HydratedDocument<User>;


export class Address {
    @Prop()
    @IsOptional()
    @IsString()
    streetName?: string;
  
    @Prop()
    @IsOptional()
    @IsString()
    province?: string;
  
    @Prop()
    @IsOptional()
    @IsString()
    zone?: string;
  
    @Prop()
    @IsOptional()
    @IsString()
    district?: string;
  
    @Prop()
    @IsOptional()
    @IsString()
    localGovernmentArea?: string;
  
    @Prop({required: true})
    @IsString()
    state: string;
  
    @Prop({required: true})
    @IsString()
    country: string;
  }

@Schema({ timestamps: true })
export class UserMatch extends Document {
    @Prop({ required: true })
    senderId: string;

    @Prop({ required: true })
    receiverId: string;

    @Prop({ required: false })
    apartmentListingId?: string;

    @Prop({ required: false })
    selfListingId?: string;

    @Prop({ required: false })
    proposedRentPrice?: number;

    @Prop({ required: true, default: matchStatus.PENDING, enum: matchStatus })
    status: matchStatus;
}


@Schema({ timestamps: true })
export class UserComplaint extends Document {
    @Prop({ type: String, required: true })
    reporterId: string;

    @Prop({ type: String, required: true })
    reporteeId: string;

    @Prop({
        type: {
            complainType: { type: String, enum: ComplaintsType },
            complainInfo: { type: String },
        },
        required: true
    })
    complaintDetails: {
        complainType: ComplaintsType;
        complainInfo: string
    }
}

@Schema({ timestamps: true })
export class UserReview extends Document {
    @Prop({ type: Number, required: true })
    rating: number;

    @Prop({ required: false, type: String })
    comment?: string;

    @Prop({ required: true, type: String })
    raterUserId: string;

    @Prop({ required: true, type: String })
    rateeUserId: string;
}


@Schema({ timestamps: true })
export class UserActivityLog extends Document {
    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: String, enum: UserActivityType, required: true })
    activityType: UserActivityType;

    @Prop({ type: Boolean, required: false, default: false })
    isGuest?: boolean;

    @Prop({ type: Object, required: false, default: {} })
    params: {};
}

export class Verification {
    @Prop({ required: true })
    @IsOptional()
    @IsString()
    verificationCode?: string;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ required: true, enum: VerificationReason })
    @IsOptional()
    @IsString()
    reason?: VerificationReason;
}




@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, lowercase: true })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Prop({ required: true })
    @IsNotEmpty()
    password: string;

    @Prop({ required: false })
    @IsNotEmpty()
    @IsOptional()
    firstName?: string;

    @Prop({ required: false })
    @IsNotEmpty()
    @IsOptional()
    lastName?: string;

    @Prop({ required: false })
    @IsOptional()
    @IsNotEmpty()
    phoneNumber?: string;

    @Prop({ required: false })
    @IsNotEmpty()
    @IsOptional()
    address?: Address;

    @Prop({ required: false, type: Verification })
    @IsOptional()
    verificationDetails?: Verification;

    @Prop({ required: false, type: String, enum: Gender })
    @IsNotEmpty()
    @IsOptional()
    gender?: Gender;

    @Prop({ required: false, type: String, enum: UserRegistrationStage })
    @IsNotEmpty()
    @IsOptional()
    stage?: UserRegistrationStage;

    @Prop({ required: false, type: String, enum: Sexuality })
    @IsNotEmpty()
    @IsOptional()
    sexuality?: Sexuality;

    @Prop({ required: false })
    @IsOptional()
    profilePicture?: string;

    @Prop({ enum: UserStatus, default: UserStatus.INACTIVE})
    @IsOptional()
    status: UserStatus;

    @Prop({ required: false })
    @IsNotEmpty()
    @IsOptional()
    apartmentListingId?: string;

    @Prop({ required: false })
    @IsNotEmpty()
    @IsOptional()
    selfListingId?: string;

    @Prop({ required: false })
    @IsNotEmpty()
    @IsOptional()
    declutterItemsIds?: string[];

    @Prop({ required: false })
    @IsNotEmpty()
    @IsOptional()
    matchIds?: string[];

    @Prop({ required: false })
    @IsNotEmpty()
    @IsOptional()
    complaintIds?: string[];

    @Prop({ required: false })
    @IsNotEmpty()
    @IsOptional()
    reviewIds?: string[];
}




export const UserSchema = SchemaFactory.createForClass(User);
export const UserMatchSchema = SchemaFactory.createForClass(UserMatch);
export const UserComplaintSchema = SchemaFactory.createForClass(UserComplaint);
export const UserReviewSchema = SchemaFactory.createForClass(UserReview);
export const UserActivityLogSchema = SchemaFactory.createForClass(UserActivityLog);