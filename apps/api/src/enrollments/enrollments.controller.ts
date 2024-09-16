import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { AdminOrStudentGuard, JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CreateEnrollmentDto } from './dto/enrollments.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('enrollments')
@ApiBadRequestResponse({
  description: 'Bad request. There was something wrong with your request',
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized. You do not have access to this resource',
})
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @UseGuards(AdminOrStudentGuard)
  @Post()
  @ApiOperation({
    summary: 'Create a new enrollment',
    description:
      'Creating a course enrollment that matches the specified courseId.After creation, the userId field of the enrollment will match the id of the student who is creating it. If an Admin is creating it, he or she can choose any userId he or she wants, as long as there is a user with that id',
  })
  @ApiCreatedResponse({
    description: 'The enrollment has been successfully created.',
  })
  @ApiBody({ type: CreateEnrollmentDto })
  create(@Body() createEnrollmentDto: CreateEnrollmentDto, @Req() req) {
    return this.enrollmentsService.create(createEnrollmentDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all the enrollments',
    description:
      'Returns the list of registrations, possibly filtered by userId and/or courseId Registrations are returned if the user is admin; or if the user is a professor and the registrations are for a course he teaches; or if the user is a student and the registrations are related to him',
  })
  @ApiOkResponse({
    description:
      'List of all the enrollments (potentially filtered by userId and/or courseId).',
  })
  @ApiForbiddenResponse({
    description:
      'Access denied. (1) You are not the owner of these enrollments. or (2) You are not the owner of this course, thus you cannot see its enrollments',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'The ID of the user to filter enrollments by (optional)',
    type: String,
  })
  @ApiQuery({
    name: 'fileId',
    required: false,
    description: 'The ID of the course to filter enrollments by (optional)',
    type: String,
  })
  findAll(
    @Req() req,
    @Query('userId') userId?: string,
    @Query('courseId') courseId?: string,
  ) {
    return this.enrollmentsService.findAll(req, +userId, +courseId);
  }

  @UseGuards(AdminOrStudentGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Get an enrollment by id.',
    description:
      'Returns the subscription that the specified id belongs to The subscription is returned if the user is admin; or if the user is the one who wrote the review',
  })
  @ApiOkResponse({ description: 'Enrollment found.' })
  @ApiForbiddenResponse({
    description:
      "Access denied. You cannot see the details of an enrollment if you're not the owner.",
  })
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
  @ApiOperation({
    summary: 'Delete an enrollment by id.',
    description:
      'Deletes the membership that the specified id belongs to. The review is deleted if the user is admin; or if the user is the student who wrote the review',
  })
  @ApiOkResponse({
    description: 'The enrollment has been successfully deleted.',
  })
  @ApiForbiddenResponse({
    description:
      "Access denied. You cannot delete an enrollment that's not yours.",
  })
  remove(@Param('id') id: string, @Req() req) {
    return this.enrollmentsService.remove(+id, req);
  }
}
