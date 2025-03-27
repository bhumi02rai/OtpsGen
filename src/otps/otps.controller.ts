import { Controller, Post, Body } from '@nestjs/common';
import { OtpsService } from './otps.service';

@Controller('otp')
export class OtpsController {
  constructor(private readonly otpService: OtpsService) {}

  @Post('generate')
  generateOtp(@Body('userId') userId: string) {
    return this.otpService.generateOtp(userId);
  }

  @Post('verify')
  verifyOtp(@Body('userId') userId: string, @Body('otp') otp: string) {
    return { message: this.otpService.verifyOtp(userId, otp) };
  }
}