import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv';
import { User, UserActivityLog, UserActivityLogSchema, UserComplaint, UserComplaintSchema, UserMatch, UserMatchSchema, UserReview, UserReviewSchema, UserSchema } from './schema/user.schema';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { MarketplaceController } from './marketplace/marketplace.controller';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { MarketplaceService } from './marketplace/marketplace.service';
import { ApartmentListing, ApartmentListingSchema, SelfListing, SelfListingSchema } from './schema/listing.schema';
import { JwtAuthGuard } from './utils/guard/user.guard.service';

config();

const databaseUrl = process.env.DATABASE_URL;

@Module({
  imports: [
    MongooseModule.forRoot(databaseUrl),
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    // MongooseModule.forFeature([
    //   { name: UserActivityLog.name, schema: UserActivityLogSchema },
    //   { name: User.name, schema: UserSchema },
    //   { name: UserMatch.name, schema: UserMatchSchema },
    //   { name: UserReview.name, schema: UserReviewSchema },
    //   { name: ApartmentListing.name, schema: ApartmentListingSchema },
    //   { name: SelfListing.name, schema: SelfListingSchema },
    //   { name: UserComplaint.name, schema: UserComplaintSchema },
    // ]),
    forwardRef(() => UserModule),
    forwardRef(() => MarketplaceModule),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
