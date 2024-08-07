import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { Prisma } from '@prisma/client';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) { }

  @Post()
  create(@Body() createEnrollmentDto: Prisma.EnrollmentCreateInput) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get()
  findAll(@Query('studentId') studentId?: string, @Query("courseId") courseId?: string) {
    return this.enrollmentsService.findAll(+studentId, +courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnrollmentDto: Prisma.EnrollmentUpdateInput) {
    return this.enrollmentsService.update(+id, updateEnrollmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(+id);
  }
}
