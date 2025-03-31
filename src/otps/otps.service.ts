import { Injectable, BadRequestException, GoneException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const OTP_FILE_PATH = path.join(__dirname, '../../otp.json');

export interface OtpData {
  userId: string;
  otp: string;
  generatedAt: Date;
}

@Injectable()
export class OtpsService {
  private readOtpStore(): Record<string, OtpData> {
    if (!fs.existsSync(OTP_FILE_PATH)) {
      return {};
    }
    try {
      const data = fs.readFileSync(OTP_FILE_PATH, 'utf-8');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading OTP store:', error);
      return {};
    }
  }

  private writeOtpStore(data: Record<string, OtpData>): void {
    try {
      fs.writeFileSync(OTP_FILE_PATH, JSON.stringify(data, null, 2), { flag: 'w' });
    } catch (error) {
      console.error('Error writing OTP store:', error);
    }
  }

  generateOtp(userId: string): OtpData {
    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
    const generatedAt = new Date();

    const otpStore = this.readOtpStore();
    otpStore[userId] = { userId, otp, generatedAt };
    
    this.writeOtpStore(otpStore);
    return { userId, otp, generatedAt };
  }

  verifyOtp(userId: string, otp: string): string {
    const otpStore = this.readOtpStore();
    const storedOtpData = otpStore[userId];

    if (!storedOtpData) {
      throw new BadRequestException({ message: 'Invalid OTP' });
    }

    const now = new Date();
    const diff = (now.getTime() - new Date(storedOtpData.generatedAt).getTime()) / 1000;

    if (diff > 600) {
      throw new GoneException({ message: 'OTP expired' });
    }

    if (storedOtpData.otp !== otp) {
      throw new BadRequestException({ message: 'Incorrect OTP' });
    }

    return 'OTP verified';
  }
}
