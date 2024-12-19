/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { ApartmentListing, ApartmentListingSchema, SelfListing, SelfListingSchema } from 'src/Schema/listing.schema';
import { User, UserSchema, UserActivityLog, UserActivityLogSchema, UserReview, UserReviewSchema, UserComplaint, UserComplaintSchema, UserMatchSchema, UserMatch } from 'src/Schema/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/Utils/Guard/user.guard.service';
import { MarketplaceModule } from 'src/Marketplace/marketplace.module';
import { MarketplaceService } from 'src/Marketplace/marketplace.service';
import { OAuth2Client } from 'google-auth-library';
import Mailgun from 'mailgun.js';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserActivityLog.name, schema: UserActivityLogSchema },
      { name: User.name, schema: UserSchema },
    ]),
    forwardRef(() => MarketplaceModule),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: UserService,
      useFactory: (
        userModel: Model<User>,
        userActivityLogModel: Model<UserActivityLog>,
        configService: ConfigService,
        marketplaceService: MarketplaceService,
      ) => {
        return new UserService(
          userModel,
          userActivityLogModel,
          configService,
          marketplaceService,
        );
      },
      inject: [
        getModelToken(User.name),
        getModelToken(UserActivityLog.name),
        ConfigService,
        // MarketplaceService
      ],
    }
  ],
  exports: [UserService],
})
export class UserModule { }