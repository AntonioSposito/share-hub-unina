import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PrismaModule } from 'prisma/prisma.module';
import {
  AdminOrSelfStrategy,
  AdminOrProfessorStrategy,
  JwtAuthStrategy,
  ProfessorStrategy,
} from 'src/auth/jwt/jwt.strategy';

@Module({
  imports: [PrismaModule],
  controllers: [FilesController],
  providers: [
    FilesService,
    AdminOrSelfStrategy,
    AdminOrProfessorStrategy,
    JwtAuthStrategy,
    ProfessorStrategy,
  ],
})
export class FilesModule {}
