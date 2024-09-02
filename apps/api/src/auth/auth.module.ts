import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthHelpers } from './helpers/auth.helpers';
import {
  AdminStrategy,
  AdminOrProfessorStrategy,
  AdminOrStudentStrategy,
} from './jwt/jwt.strategy';

@Module({
  imports: [JwtModule, PassportModule, AuthHelpers],
  controllers: [AuthController],
  providers: [
    AuthService,
    AdminStrategy,
    AdminOrProfessorStrategy,
    AdminOrStudentStrategy,
  ],
})
export class AuthModule {}
