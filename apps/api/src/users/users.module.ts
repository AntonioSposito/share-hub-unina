import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { AdminOrSelfStrategy, JwtStrategy, ProfessorStrategy } from 'src/auth/jwt/jwt.strategy';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, ProfessorStrategy, AdminOrSelfStrategy],
})
export class UsersModule { }
