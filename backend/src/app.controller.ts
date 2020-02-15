import { User } from './user/user.entity';
import { Controller, Get, UseGuards, Post, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard('google'))
  @Post('auth/google')
  async googleLogin(@Request() req): Promise<User> {
    return req.user;
  }

  @UseGuards(AuthGuard('facebook'))
  @Post('auth/facebook')
  async facebookLogin(@Request() req): Promise<User> {
    return req.user;
  }
}
