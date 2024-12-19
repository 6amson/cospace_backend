import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsEnum, IsBoolean, ValidateNested, IsDate, Max, Min, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

// Import all enums from your existing types file
import {
  Religion,
  ApartmentType,
  Amenities,
  Safety,
  HouseRules,
  Accessibility,
  HouseRooms,
  LocationAccessibility,
  NearbyPlaces,
  RentType,
  MeansOfTransportToMajorRoad,
  Currency,
  Gender
} from '../utils/types/statics';

@Schema({ timestamps: true })
export class ApartmentListing {
  @Prop({ required: true, type: String })
  @IsNotEmpty()
  userId: string;

  @Prop({ required: false, type: String })
  @IsOptional()
  @IsString()
  about?: string;

  @Prop({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  rentPrice: number;

  @Prop({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'Date must be in the format YYYY-MM',
  })
  rentStartDate: string;

  @Prop({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'Date must be in the format YYYY-MM',
  })
  rentEndDate: string;

  @Prop({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Min(18)
  @Max(100)
  minimumRenterAge: number;

  @Prop({ required: true, type: String, enum: Object.values(Currency) })
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @Prop({ 
    required: true, 
    type: String, 
    enum: ['Prepaid', 'Postpaid'] 
  })
  @IsNotEmpty()
  @IsEnum(['Prepaid', 'Postpaid'])
  electricityMeterType: string;

  @Prop({ 
    required: true, 
    type: [String], 
    enum: Object.values(RentType) 
  })
  @IsNotEmpty()
  @IsEnum(RentType, { each: true })
  rentType: RentType[];

  @Prop({ 
    required: true, 
    type: String, 
    enum: Object.values(ApartmentType) 
  })
  @IsNotEmpty()
  @IsEnum(ApartmentType)
  apartmentType: ApartmentType;

  @Prop({ 
    required: false, 
    type: [String], 
    enum: Object.values(Amenities) 
  })
  @IsOptional()
  @IsEnum(Amenities, { each: true })
  amenities?: Amenities[];

  @Prop({ 
    required: false, 
    type: [String], 
    enum: Object.values(Safety) 
  })
  @IsOptional()
  @IsEnum(Safety, { each: true })
  safetyFeatures?: Safety[];

  @Prop({ 
    required: false, 
    type: [String], 
    enum: Object.values(HouseRules) 
  })
  @IsOptional()
  @IsEnum(HouseRules, { each: true })
  houseRules?: HouseRules[];

  @Prop({ 
    required: false, 
    type: [String], 
    enum: Object.values(Accessibility) 
  })
  @IsOptional()
  @IsEnum(Accessibility, { each: true })
  accessibilityFeatures?: Accessibility[];

  @Prop({ 
    required: false, 
    type: [String], 
    enum: Object.values(HouseRooms) 
  })
  @IsOptional()
  @IsEnum(HouseRooms, { each: true })
  otherHouseRooms?: HouseRooms[];

  @Prop({ 
    required: true, 
    type: [String], 
    enum: Object.values(LocationAccessibility) 
  })
  @IsNotEmpty()
  @IsEnum(LocationAccessibility, { each: true })
  locationAccessibility: LocationAccessibility[];

  @Prop({ 
    required: false, 
    type: [String], 
    enum: Object.values(NearbyPlaces) 
  })
  @IsOptional()
  @IsEnum(NearbyPlaces, { each: true })
  nearbyPlaces?: NearbyPlaces[];

  @Prop({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  noOfBathrooms: number;

  @Prop({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  noOfBedrooms: number;

  @Prop({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  canPayMonthly?: boolean;

  @Prop({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  isRentNegotiable?: boolean;

  @Prop({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  timeFromMajorRoadOrPark: string;

  @Prop({ 
    required: true, 
    type: String, 
    enum: Object.values(MeansOfTransportToMajorRoad) 
  })
  @IsNotEmpty()
  @IsEnum(MeansOfTransportToMajorRoad)
  meansFromMajorRoadOrPark: MeansOfTransportToMajorRoad;

  @Prop({ required: true, type: Boolean })
  @IsNotEmpty()
  @IsBoolean()
  landlordResidesWithin: boolean;

  @Prop({ required: false, type: String })
  @IsOptional()
  @IsString()
  comment?: string;

  @Prop({ required: false, type: String })
  @IsOptional()
  @IsString()
  closestLandmark?: string;

  @Prop({ 
    required: false, 
    type: Number, 
    min: 0, 
    max: 10 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  electricityConsistency?: number;

  @Prop({ 
    required: false, 
    type: Number, 
    min: 0, 
    max: 10 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  safetyConsistency?: number;

  @Prop({ 
    required: false, 
    type: Number, 
    min: 0, 
    max: 10 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  waterAvailabilityConsistency?: number;
}

@Schema({ timestamps: true })
export class SelfListing {
  @Prop({ required: true, type: String })
  @IsNotEmpty()
  userId: string;

  @Prop({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  minRentPrice: number;

  @Prop({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  maxRentPrice: number;

  @Prop({ required: true, type: Date })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  preferredMoveInDate: Date;

  @Prop({ 
    required: true, 
    type: String, 
    enum: Object.values(Gender) 
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  preferredGender: Gender;

  @Prop({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Min(18)
  @Max(60)
  preferredAge: number;

  @Prop({ 
    required: false, 
    type: [String], 
    enum: Object.values(Religion) 
  })
  @IsOptional()
  @IsEnum(Religion, { each: true })
  preferredReligion?: Religion[];

  @Prop({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  occupation: string;

  @Prop({ 
    required: true, 
    type: String, 
    enum: Object.values(Currency) 
  })
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @Prop({ required: true, type: Date })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  rentStartDate: Date;

  @Prop({ required: true, type: Date })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  rentEndDate: Date;

  @Prop({ 
    required: true, 
    type: String, 
    enum: ['Prepaid', 'Postpaid'] 
  })
  @IsNotEmpty()
  @IsEnum(['Prepaid', 'Postpaid'])
  electricityMeterType: string;

  @Prop({ 
    required: true, 
    type: String, 
    enum: Object.values(ApartmentType) 
  })
  @IsNotEmpty()
  @IsEnum(ApartmentType)
  apartmentType: ApartmentType;

  @Prop({ 
    required: false, 
    type: [String], 
    enum: Object.values(Amenities) 
  })
  @IsOptional()
  @IsEnum(Amenities, { each: true })
  amenities?: Amenities[];

  @Prop({ 
    required: false, 
    type: [String], 
    enum: Object.values(Safety) 
  })
  @IsOptional()
  @IsEnum(Safety, { each: true })
  safetyFeatures?: Safety[];

  @Prop({ 
    required: false, 
    type: [String], 
    enum: Object.values(HouseRules) 
  })
  @IsOptional()
  @IsEnum(HouseRules, { each: true })
  houseRules?: HouseRules[];

  @Prop({ 
    required: false, 
    type: [String], 
    enum: Object.values(Accessibility) 
  })
  @IsOptional()
  @IsEnum(Accessibility, { each: true })
  accessibilityFeatures?: Accessibility[];

  @Prop({ 
    required: false, 
    type: [String], 
    enum: Object.values(HouseRooms) 
  })
  @IsOptional()
  @IsEnum(HouseRooms, { each: true })
  otherHouseRooms?: HouseRooms[];

  @Prop({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  noOfBathrooms: number;

  @Prop({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  noOfBedrooms: number;
}

// Create Mongoose schemas
export const ApartmentListingSchema = SchemaFactory.createForClass(ApartmentListing);
export const SelfListingSchema = SchemaFactory.createForClass(SelfListing);

// Mongoose document types
export type ApartmentListingDocument = HydratedDocument<ApartmentListing>;
export type SelfListingDocument = HydratedDocument<SelfListing>;