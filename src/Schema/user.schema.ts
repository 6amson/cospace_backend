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

export type UserDocument = HydratedDocument<User>;

export enum UserActivityType {
    UPDATE_PASSWORD = 'Password Update',
    UPDATE_EMAIL = 'Email Update',
    UPDATE_PROFILE_PICTURE = 'Profile picture Update',
    UPDATE_FIRSTNAME = 'First Name Update',
    UPDATE_LASTNAME = 'Last Name Update',
    UPDATE_PHONENUMBER = 'Phone Number Update',
    VIEW_SELF_LISTING = 'View Self Listing Details',
    VIEW_APARTMENT_LISTING = 'View Apartment Listing Details',
    LOGIN = 'Login',
    LOGOUT = 'Logout',
    DELETE_ACCOUNT = 'Delete Account',
    RESET_PASSWORD = 'Reset Password',
    PUSH_NOTIFICATION_ACTIVATE = 'Subscribed To Push Notification',
    PUSH_NOTIFICATION_DEACTIVATE = 'Unsubscribed From Push Notification',
    ACCEPT_STORE_TERMS = 'Accept Store Terms',
    ACCEPT_APP_TERMS = 'Accept App Terms',
    REPORT_ISSUE = 'Report App Issue',
}

export class Address {
    streetName?: string;
    province?: string;
    zone?: string;
    district?: string;
    localGovernmentArea?: string;
    state?: string;
    country?: string;
}

export class verificationDetails {
    verifictionCode: string
}

export enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    TRANS_MAN = 'Trans man',
    TRANS_WOMAN = 'Trans woman',
    NON_BINARY = 'Non binary',
    OTHERS = 'others',
    PREFER_NOT_TO_SAY = 'Prefer not to say',
}

export enum EmailTypeKey {
    verifyEmail = 'verifyEmail',
    passwordReset = 'passwordReset',
    resendEmailVerificationCode = 'resendEmailVerificationCode',
    listingSuccess = 'listingSuccess',
    listingDelisted = 'listingDelisted',
}

export enum ComplaintsType {
    SEXUAL_ASSAULT = 'Sexual Assault',
    CUSTOM = 'custom complaint',
}

export enum UserRegistrationStage {
    VERIFY_EMAIL = 'verifyEmail',
    VERIFY_PROFILE = 'verifyProfile',
    COMPLETE = 'complete',
}

export enum Sexuality {
    HETEROSEXUAL = 'Heterosexual',
    QUEER = 'Queer',
    PREFER_NOT_TO_SAY = 'Prefer not to say',
}


export enum Ethnicity {
    WHITE = 'White',
    BLACK_AFRICAN_AMERICAN = 'Black or African American',
    HISPANIC_LATINO = 'Hispanic or Latino',
    EAST_ASIAN = 'East Asian',
    SOUTHEAST_ASIAN = 'Southeast Asian',
    SOUTH_ASIAN = 'South Asian',
    NATIVE_HAWAIIAN = 'Native Hawaiian or Other Pacific Islander',
    AMERICAN_INDIAN = 'American Indian or Alaska Native',
    MIDDLE_EASTERN_NORTH_AFRICAN = 'Middle Eastern or North African',
    MIXED = 'Mixed',
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

    @Prop({ required: false })
    @IsOptional()
    verificationCode?: string;

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

    @Prop({ enum: ['Active', 'Inactive', 'Banned',] })
    @IsOptional()
    status: string;

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

    @Prop({ required: true, default: false })
    isMatchAccepted?: boolean;

    @Prop({ required: true, default: false })
    isMatchRejected?: boolean;

    @Prop({ required: true, default: 0 })
    percentageMatch?: number;
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
    @Prop({ type: Number, required: false})
    rating: number;

    @Prop({ required: true, type: String })
    comment: string;

    @Prop({ required: true, type: String })
    raterId: string;

    @Prop({ required: true, type: String })
    rateeId:   string;
}

@Schema({ timestamps: true })
export class UserRevi {
    @Prop({ required: false })
    starRatingDetails: string;

    @Prop({ required: true })
    reviewComment: string;
}


@Schema({ timestamps: true })
export class UserActivityLog extends Document {
    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: String, enum: UserActivityType, required: true })
    activityType: UserActivityType;

    @Prop({ type: Boolean, required: true, default: false })
    isGuest: boolean;

    @Prop({ type: Object, required: false, default: {} })
    params: {};
}


export const UserSchema = SchemaFactory.createForClass(User);
export const UserMatchSchema = SchemaFactory.createForClass(UserMatch);
export const UserComplaintSchema = SchemaFactory.createForClass(UserComplaint);
export const UserActivityLogSchema = SchemaFactory.createForClass(UserActivityLog);