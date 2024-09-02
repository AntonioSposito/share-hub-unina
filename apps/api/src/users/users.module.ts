import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'prisma/prisma.module';
import {
  AdminOrSelfStrategy,
  AdminOrProfessorStrategy,
  JwtAuthStrategy,
  ProfessorStrategy,
} from 'src/auth/jwt/jwt.strategy';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtAuthStrategy,
    ProfessorStrategy,
    AdminOrSelfStrategy,
    AdminOrProfessorStrategy,
  ],
})
export class UsersModule {}
