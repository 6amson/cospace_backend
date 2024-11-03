import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv';
import { User, UserActivityLog, UserActivityLogSchema, UserMatch, UserMatchSchema, UserSchema } from './Schema/user.schema';

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
      // { name: User.name, schema: UserSchema },
    ]),

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
