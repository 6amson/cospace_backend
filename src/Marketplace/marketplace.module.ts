/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceController } from './marketplace.controller';
import { ApartmentListing, ApartmentListingSchema, SelfListing, SelfListingSchema } from 'src/Schema/listing.schema';
import { User, UserSchema, UserActivityLog, UserActivityLogSchema, UserReview, UserReviewSchema, UserComplaint, UserComplaintSchema, UserMatchSchema, UserMatch } from 'src/Schema/user.schema';
import { UserModule } from 'src/User/user.module';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserActivityLog.name, schema: UserActivityLogSchema },
      { name: User.name, schema: UserSchema },
      { name: UserMatch.name, schema: UserMatchSchema },
      { name: UserReview.name, schema: UserReviewSchema },
      { name: UserComplaint.name, schema: UserComplaintSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [MarketplaceController],
  providers: [
    {
      provide: MarketplaceService,
      useFactory: (
        userModel: Model<User>,
        userActivityLogModel: Model<UserActivityLog>,
        userReview: Model<UserReview>,
        userComplaint: Model<UserComplaint>,
        configService: ConfigService,
        userService: UserService
      ) => {
        return new MarketplaceService(
          userModel,
          userActivityLogModel,
          userReview,
          userComplaint,
          configService,
          userService
        );
      },
      inject: [
        getModelToken(User.name),
        getModelToken(UserActivityLog.name),
        getModelToken(UserReview.name),
        getModelToken(UserComplaint.name),
        ConfigService,
        // UserService,
        // forwardRef(() => UserService),
      ],
    }
  ],
  exports: [MarketplaceService],
})
export class MarketplaceModule { }