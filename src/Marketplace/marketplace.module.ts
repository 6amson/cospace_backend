/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    MongooseModule.forFeature([
        
  ])
],
  controllers: [

  ],
  providers: [

  ],
  exports: [MongooseModule],
})
export class MarketplaceModule { }