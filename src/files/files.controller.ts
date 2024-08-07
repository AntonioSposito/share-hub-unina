import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FilesService } from './files.service';
import { Prisma } from '@prisma/client';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post()
  create(@Body() createFileDto: Prisma.FileCreateInput) {
    return this.filesService.create(createFileDto);
  }

  @Get()
  findAll(@Query('courseId') courseId?: string) {
    return this.filesService.findAll(+courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: Prisma.FileUpdateInput) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
