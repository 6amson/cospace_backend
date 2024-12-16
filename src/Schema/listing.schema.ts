import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsArray,
    ValidateNested,
    IsEnum,
    Max,
    Min,
    isNotEmpty,
    IsNumber,
    Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HydratedDocument, Document, Types } from 'mongoose';
import { Accessibility, Amenities, ApartmentType, Currency, Gender, HouseRooms, HouseRules, locationAccessibility, MeansOfTransportToMAjorRoad, NearbyPlaces, Religion, RentType, Safety } from 'src/Utils/Types/statics';
import { Optional } from '@nestjs/common';

export type ApartmentListingDocument = ApartmentListing & Document;
export type SelfListingDocument = SelfListing & Document;


@Schema({ timestamps: true })
export class ApartmentListing {
    @Prop({ required: true })
    @IsNotEmpty()
    userId: string;

    @Prop({ required: false })
    @IsNotEmpty()
    @IsOptional()
    about?: string;

    @Prop({ required: true })
    @IsNotEmpty()
    rentPrice: number;

    @Prop({ required: true })
    @IsNotEmpty()
    @IsString()
    @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
      message: 'Date must be in the format YYYY-MM',
    })
    rentStartDate: string; 
  
    @Prop({ required: true })
    @IsNotEmpty()
    @IsString()
    @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
      message: 'Date must be in the format YYYY-MM',
    })
    rentEndDate: string;

    @Prop({ required: true })
    @IsNotEmpty()
    minimumRenterAge: number;

    @Prop({ required: true })
    @IsNotEmpty()
    currency: Currency;

    @Prop({ required: true, enum: ["Prepaid", "Postpaid",] })
    @IsNotEmpty()
    @IsEnum(["Prepaid", "Postpaid",], { message: 'Meter type must be either "Prepaid"or "Postpaid"' })
    electricityMeterType: string;

    @Prop({ required: true, enum: RentType })
    @IsNotEmpty()
    @IsEnum(RentType, { message: 'Rent type must be either "Long" or "HandOver"' })
    rentType: RentType[];

    @Prop({ required: true, enum: ApartmentType })
    @IsNotEmpty()
    @IsEnum(ApartmentType, { message: 'Apartment type does not tally, please, retry.' })
    apartmentType: ApartmentType;

    @Prop({ required: false, type: [Amenities], enum: Amenities })
    @Optional()
    @IsEnum(Amenities, { each: true, message: 'Some amenities are invalid, please check your selections.' })
    amenities?: Amenities[];

    @Prop({ required: false, type: [Safety], enum: Safety })
    @Optional()
    @IsEnum(Safety, { each: true, message: 'Some safety features are invalid, please check your selections.' })
    safetyFeatures?: Safety[];

    @Prop({ required: false, type: [HouseRules], enum: HouseRules })
    @Optional()
    @IsEnum(HouseRules, { each: true, message: 'Some house rules are invalid, please check your selections.' })
    houseRules?: HouseRules[];

    @Prop({ required: false, type: [Accessibility], enum: Accessibility })
    @Optional()
    @IsEnum(Accessibility, { each: true, message: 'Some accessibility features are invalid, please check your selections.' })
    accessibilityFeatures?: Accessibility[];

    @Prop({ required: false, type: [HouseRooms], enum: HouseRooms })
    @Optional()
    @IsEnum(HouseRooms, { each: true, message: 'Some apartment rooms options are invalid, please check your selections.' })
    otherHouseRooms?: HouseRooms[];

    @Prop({ required: true, type: locationAccessibility })
    @IsNotEmpty()
    @IsEnum(locationAccessibility, { each: true, message: 'Some location accessbility options are invalid, please check your selections.' })
    locationAccessibility: locationAccessibility[];

    @Prop({ required: false, type: NearbyPlaces })
    @IsOptional()
    @IsEnum(NearbyPlaces, { each: true, message: 'Invalid place selected.' })
    nearbyPlaces?: NearbyPlaces[];

    @Prop({ required: true })
    @IsNotEmpty()
    noOfBathrooms: number;

    @Prop({ required: true })
    @IsNotEmpty()
    noOfBedrooms: number;

    @Prop({ required: false, type: Boolean })
    @IsOptional()
    canPayMonthly?: boolean;

    @Prop({ required: false, type: Boolean })
    @IsOptional()
    isRentNegotiable?: boolean;

    @Prop({ required: true, type: String })
    @IsOptional()
    timeFromMajorRoadOrPark: string; //20mins, 1hr, 5s

    @Prop({ required: true, type: MeansOfTransportToMAjorRoad })
    @IsOptional()
    meansFromMajorRoadOrPark: MeansOfTransportToMAjorRoad; //20mins, 1hr, 5s

    @Prop({ required: true, type: Boolean })
    @IsOptional()
    landlordResidesWithin: boolean;

    @Prop({ required: false, type: String })
    @IsOptional()
    comment?: string;

    @Prop({ required: false, type: String })
    @IsOptional()
    closestLandmark?: string;

    @Prop({ required: false, type: Number })
    @Max(10, { message: "Electricty consistency range cannot be more than 10" })
    @Min(0, { message: "Electricty consistency range cannot be less than 0" })
    electricityConsitency: number;

    @Prop({ required: false, type: Number })
    @Max(10, { message: "Safety consistency range cannot be more than 10" })
    @Min(0, { message: "Safety consistency range cannot be less than 0" })
    safetyConsistency: number; //how safe is the environment

    @Prop({ required: false, type: Number })
    @Max(10, { message: "Water availability range cannot be more than 10" })
    @Min(0, { message: "Water availability range cannot be less than 0" })
    waterAvailabilityConsitency: number;
}



export class SelfListing {
    @Prop({ required: true })
    @IsNotEmpty()
    userId: string;

    @Prop({ required: true })
    @IsNotEmpty()
    @IsNumber()
    minRentPrice: number;
  
    @Prop({ required: true })
    @IsNotEmpty()
    @IsNumber()
    maxRentPrice: number;

    @Prop({ required: true })
    @IsNotEmpty()
    prefferedMoveInDate: Date;

    @Prop({ required: true })
    @IsNotEmpty()
    prefferedGender: Gender;

    @Prop({ required: true })
    @Max(60, { message: "Age cannot be more than 60" })
    @Min(18, { message: "Age cannot be lower than 18" })
    @IsNotEmpty()
    @IsNumber()
    prefferedAge: number;

    @Prop({ required: true })
    @IsNotEmpty()
    prefferedReligion: Religion[];

    @Prop({ required: true })
    @IsNotEmpty()
    occupation: string;

    @Prop({ required: true })
    @IsNotEmpty()
    currency: string;

    @Prop({ required: true })
    @IsNotEmpty()
    rentStartDate: Date;

    @Prop({ required: true })
    @IsNotEmpty()
    rentEndDate: Date;

    @Prop({ required: true, enum: ["Prepaid", "Postpaid", ] })
    @IsNotEmpty()
    @IsEnum(["Prepaid", "Postpaid",], { message: 'Meter type must be either "Prepaid"or "Postpaid"' })
    electricityMeterType: string;

    @Prop({ required: true, enum: ApartmentType })
    @IsNotEmpty()
    @IsEnum(ApartmentType, { message: 'Apartment type does not tally, please, retry.' })
    apartmentType: ApartmentType;

    @Prop({ required: false, type: [Amenities], enum: Amenities })
    @Optional()
    @IsEnum(Amenities, { each: true, message: 'Some amenities are invalid, please check your selections.' })
    amenities?: Amenities[];

    @Prop({ required: false, type: [Safety], enum: Safety })
    @Optional()
    @IsEnum(Safety, { each: true, message: 'Some safety features are invalid, please check your selections.' })
    safetyFeatures?: Safety[];

    @Prop({ required: false, type: [HouseRules], enum: HouseRules })
    @Optional()
    @IsEnum(HouseRules, { each: true, message: 'Some house rules are invalid, please check your selections.' })
    houseRules?: HouseRules[];

    @Prop({ required: false, type: [Accessibility], enum: Accessibility })
    @Optional()
    @IsEnum(Accessibility, { each: true, message: 'Some accessibility features are invalid, please check your selections.' })
    accessibilityFeatures?: Accessibility[];

    @Prop({ required: false, type: [HouseRooms], enum: HouseRooms })
    @Optional()
    @IsEnum(HouseRooms, { each: true, message: 'Some apartment rooms options are invalid, please check your selections.' })
    otherHouseRooms?: HouseRooms[];

    @Prop({ required: true })
    @IsNotEmpty()
    noOfBathrooms: number;

    @Prop({ required: true })
    @IsNotEmpty()
    noOfBedrooms: number;
}


export const ApartmentListingSchema = SchemaFactory.createForClass(ApartmentListing);
export const SelfListingSchema = SchemaFactory.createForClass(SelfListing);

