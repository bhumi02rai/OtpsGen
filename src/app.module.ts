import { Module } from '@nestjs/common';
import { OtpsService } from './otps/otps.service';
import { OtpsController } from './otps/otps.controller';
import { OtpsModule } from './otps/otps.module';

@Module({
  imports: [OtpsModule],
  controllers: [ OtpsController],
  providers: [OtpsService],
})
export class AppModule {}
