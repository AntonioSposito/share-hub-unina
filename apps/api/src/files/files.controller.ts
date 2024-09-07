import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { Prisma } from '@prisma/client';
import {
  AdminGuard,
  AdminOrProfessorGuard,
  JwtAuthGuard,
} from 'src/auth/jwt/jwt.guard';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { CreateFileDto, UpdateFileDto } from './dto/files.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(AdminOrProfessorGuard)
  @Post()
  create(@Body() createFileDto: CreateFileDto, @Req() req) {
    return this.filesService.create(createFileDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req, @Query('courseId') courseId?: string) {
    return this.filesService.findAll(req, +courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.filesService.findOne(+id, req);
  }

  @UseGuards(AdminOrProfessorGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFileDto: UpdateFileDto,
    @Req() req,
  ) {
    return this.filesService.update(+id, updateFileDto, req);
  }

  @UseGuards(AdminOrProfessorGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.filesService.remove(+id, req);
  }
}
