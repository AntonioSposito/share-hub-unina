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
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { Prisma } from '@prisma/client';
import { AdminOrStudentGuard, JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CreateEnrollmentDto } from './dto/enrollments.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @UseGuards(AdminOrStudentGuard)
  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto, @Req() req) {
    return this.enrollmentsService.create(createEnrollmentDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Req() req,
    @Query('userId') userId?: string,
    @Query('courseId') courseId?: string,
  ) {
    return this.enrollmentsService.findAll(req, +userId, +courseId);
  }

  @UseGuards(AdminOrStudentGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.enrollmentsService.findOne(+id, req);
  }

  //Potrebbe essere inutile, di base non c'è molto da modificare nell'iscrizione, la si cancella soltanto
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEnrollmentDto: Prisma.EnrollmentUpdateInput) {
  //   return this.enrollmentsService.update(+id, updateEnrollmentDto);
  // }

  @UseGuards(AdminOrStudentGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.enrollmentsService.remove(+id, req);
  }
}
