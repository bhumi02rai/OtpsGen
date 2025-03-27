import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OtpsService } from './otps/otps.service';
import { OtpsController } from './otps/otps.controller';
import { OtpsModule } from './otps/otps.module';

@Module({
  imports: [OtpsModule],
  controllers: [AppController, OtpsController],
  providers: [AppService, OtpsService],
})
export class AppModule {}
