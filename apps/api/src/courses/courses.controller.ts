import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/courses.dto';
import { AdminOrProfessorGuard, JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @UseGuards(AdminOrProfessorGuard)
  @Post()
  create(@Body() createCourseDto: CreateCourseDto, @Req() req) {
    return this.coursesService.create(createCourseDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.coursesService.findAll(+userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }

  @UseGuards(AdminOrProfessorGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() req,
  ) {
    return this.coursesService.update(+id, updateCourseDto, req);
  }

  @UseGuards(AdminOrProfessorGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.coursesService.remove(+id, req);
  }
}
