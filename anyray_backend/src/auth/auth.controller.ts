import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupUserDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    const user = await this.authService.login(dto);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return user;
  }
}
