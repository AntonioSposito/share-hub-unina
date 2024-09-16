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
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBody,
  ApiForbiddenResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('courses') // Assicurati che il tag sia appropriato
@ApiBadRequestResponse({
  description: 'Bad request. There was something wrong with your request',
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized. You do not have access to this resource',
})
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @UseGuards(AdminOrProfessorGuard)
  @Post()
  @ApiOperation({
    summary: 'Create a new course',
    description:
      'Creating a course. After creation, the userId field of the course will correspond to the id of the professor who is creating it. If an Admin is creating it, he can choose the userId he wants, as long as there is a user with that id',
  })
  @ApiCreatedResponse({
    description: 'The course has been successfully created.',
  })
  @ApiBody({ type: CreateCourseDto })
  create(@Body() createCourseDto: CreateCourseDto, @Req() req) {
    return this.coursesService.create(createCourseDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all courses',
    description:
      'Returns the list of courses, possibly held by the user to whom userId belongs',
  })
  @ApiOkResponse({
    description: 'List of all courses (potentially filtered by user)',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'The ID of the user to filter courses by (optional)',
    type: String,
  })
  findAll(@Query('userId') userId?: string) {
    return this.coursesService.findAll(+userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Get a course by ID',
    description:
      'Returns the details of the course the specified id belongs to',
  })
  @ApiOkResponse({ description: 'Course found.' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }

  @UseGuards(AdminOrProfessorGuard)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a course by ID',
    description:
      'Updates the information about the course the specified id belongs to. The userId field of the course must match the id of the professor who is editing it',
  })
  @ApiOkResponse({
    description: 'The course has been successfully updated.',
  })
  @ApiBody({ type: UpdateCourseDto })
  @ApiForbiddenResponse({
    description:
      'Forbidden. Only admins and the Professor owner of this course can edit it.',
  })
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() req,
  ) {
    return this.coursesService.update(+id, updateCourseDto, req);
  }

  @UseGuards(AdminOrProfessorGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a course by ID',
    description:
      'Deletes the course that the specified id belongs to. The userId field of the course must match the id of the professor who is deleting it',
  })
  @ApiOkResponse({
    description: 'The course has been successfully deleted.',
  })
  @ApiBody({ type: UpdateCourseDto })
  @ApiForbiddenResponse({
    description:
      'Forbidden. Only admins and the Professor owner of this course can delete it.',
  })
  remove(@Param('id') id: string, @Req() req) {
    return this.coursesService.remove(+id, req);
  }
}
