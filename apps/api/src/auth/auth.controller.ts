import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto/auth.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@ApiBadRequestResponse({
  description: 'Bad request. There was something wrong with your request',
})
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Allows the registration of a new user',
  })
  @ApiCreatedResponse({
    description: 'Signup was successfull.',
  })
  @ApiBody({ type: SignupDto })
  signup(@Body() createUserDto: SignupDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('signin')
  @ApiOperation({
    summary: 'Login',
    description: 'Allows login, returns JWT authentication token to user',
  })
  @ApiCreatedResponse({
    description: 'Logged in successfully.',
  })
  @ApiBody({ type: SigninDto })
  signin(@Body() loginUserDto: SigninDto, @Res() res) {
    return this.authService.signin(loginUserDto, res);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Logout',
    description: 'Allows log out, removes JWT authentication token',
  })
  @ApiFoundResponse({
    description: 'Logged out successfully.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Get('signout')
  signout(@Res() res) {
    return this.authService.signout(res);
  signout(@Res() res) {
    return this.authService.signout(res);
  }
}
