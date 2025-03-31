import { Controller, Post, Param, Body, HttpException, HttpStatus, Res } from '@nestjs/common';
import { OtpsService } from './otps.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('otp')
@ApiTags('OTPS')
export class OtpsController {
  constructor(private readonly otpService: OtpsService) {}

  @Post('generate/:userId')
  @ApiOperation({ summary: 'Generate OTP' })
  @ApiResponse({ 
    status: 201, 
    description: 'OTP successfully generated',
    content: {
      'application/json': {
        example: {
          userId: 'user3',
          otp: '654321',
          generatedAt: '2025-03-31T12:00:00.000Z'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal Server Error',
    content: {
      'application/json': {
        example: { message: 'An unexpected error occurred' }
      }
    }
  })
 
  @ApiParam({ name: 'userId', type: 'string', required: false })
  generateOtp(@Param('userId') userId: string) {
    return this.otpService.generateOtp(userId);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify OTP' })
  @ApiResponse({ 
    status: 200, 
    description: 'OTP verified successfully',
    content: {
      'application/json': {
        example: { message: 'OTP verified' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid OTP or request',
    content: {
      'application/json': {
        example: { message: 'Incorrect OTP' }
      }
    }
  })
  @ApiResponse({ 
    status: 410, 
    description: 'OTP expired',
    content: {
      'application/json': {
        example: { message: 'OTP expired' }
      }
    }
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['userId', 'otp'], 
      properties: {
        userId: { type: 'string', example: 'user1' },
        otp: { type: 'number', example: 123456 }
      }
    }
  })
  verifyOtp(@Body('userId') userId: string, @Body('otp') otp: string,@Res() res:Response) {
    const result = this.otpService.verifyOtp(userId, otp);
    
    if (result === 'OTP expired') {
      throw new HttpException({ message: 'OTP expired' }, HttpStatus.GONE);
    } else if (result === 'Incorrect OTP') {
      throw new HttpException({ message: 'Incorrect OTP' }, HttpStatus.BAD_REQUEST);
    }
    
    //return { message: result };
    return res.status(HttpStatus.OK).json({message: result})
  }
}