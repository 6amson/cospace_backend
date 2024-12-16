import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv';
import { User, UserActivityLog, UserActivityLogSchema, UserMatch, UserMatchSchema, UserReview, UserReviewSchema, UserSchema } from './Schema/user.schema';
import { UserModule } from './User/user.module';
import { UserService } from './user/user.service';
import { UserController } from './User/user.controller';
import { MarketplaceController } from './Marketplace/marketplace.controller';
import { MarketplaceModule } from './Marketplace/marketplace.module';
import { MarketplaceService } from './Marketplace/marketplace.service';
import { ApartmentListing, ApartmentListingSchema, SelfListing, SelfListingSchema } from './Schema/listing.schema';

config();

const databaseUrl = process.env.DATABASE_URL;

@Module({
  imports: [
    MongooseModule.forRoot(databaseUrl),
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    MongooseModule.forFeature([
      { name: UserActivityLog.name, schema: UserActivityLogSchema },
      { name: User.name, schema: UserSchema },
      { name: UserMatch.name, schema: UserMatchSchema },
      { name: UserReview.name, schema: UserReviewSchema },
      { name: ApartmentListing.name, schema: ApartmentListingSchema },
      { name: SelfListing.name, schema: SelfListingSchema },
    ]),
    UserModule
  ],
  controllers: [UserController, MarketplaceController],
  providers: [UserService, MarketplaceService],
})
export class AppModule {}
