import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto/auth.dto';
import {
  AdminOrSelfGuard,
  JwtAuthGuard,
  ProfessorGuard,
  AdminGuard,
} from 'src/auth/jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: SignupDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('signin')
  signin(@Body() loginUserDto: SigninDto, @Req() req, @Res() res) {
    return this.authService.signin(loginUserDto, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('signout')
  signout(@Req() req, @Res() res) {
    return this.authService.signout(req, res);
  }
}
