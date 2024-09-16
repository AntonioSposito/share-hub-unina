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
import { FilesService } from './files.service';
import { AdminOrProfessorGuard, JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CreateFileDto, UpdateFileDto } from './dto/files.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('files')
@ApiBadRequestResponse({
  description: 'Bad request. There was something wrong with your request',
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized. You do not have access to this resource',
})
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(AdminOrProfessorGuard)
  @Post()
  @ApiOperation({
    summary: 'Create a new file',
    description:
      "Creating a file. A professor can only create a file if the file's courseId matches a course he or she teaches.",
  })
  @ApiCreatedResponse({
    description: 'The file has been successfully created.',
  })
  @ApiBody({ type: CreateFileDto })
  create(@Body() createFileDto: CreateFileDto, @Req() req) {
    return this.filesService.create(createFileDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all files',
    description:
      'Returns a list of all files, optionally filtered for the specified courseId.The list is returned if the user is admin; or if the user is a professor and the files are part of one of his courses; or if the user is a student and the files are part of a course he is enrolled in',
  })
  @ApiOkResponse({
    description: 'List of all the files.',
  })
  @ApiForbiddenResponse({
    description:
      'Access denied. (1) You are not the professor of this course so you cannot see its files. or (2) You are not enrolled in this course so you cannot see its files.',
  })
  @ApiQuery({
    name: 'courseId',
    required: false,
    description: 'The ID of the course to filter files by (optional)',
    type: String,
  })
  findAll(@Req() req, @Query('courseId') courseId?: string) {
    return this.filesService.findAll(req, +courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Get a file by id.',
    description:
      'Returns the details of the file that the specified id belongs to. The file is returned if the user is admin; or if the user is a professor and the file is part of one of his courses; or if the user is a student and the file is part of a course in which he is enrolled',
  })
  @ApiOkResponse({ description: 'File found.' })
  @ApiForbiddenResponse({
    description:
      'Access denied. (1) You are not the professor that owns this file. Or (2) You are not enrolled in the course this file is from',
  })
  findOne(@Req() req, @Param('id') id: string) {
    return this.filesService.findOne(+id, req);
  }

  @UseGuards(AdminOrProfessorGuard)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a file by ID',
    description:
      "Updates the information about the file that the specified id belongs to. The file is only modified if the user is admin; or if the user is professor and the file's courseId field matches a course he teaches. Also, the file's courseId field cannot be modified.",
  })
  @ApiOkResponse({
    description: 'The file has been successfully updated.',
  })
  @ApiForbiddenResponse({
    description:
      'Access denied. (1) You are not the professor that owns this file, thus you cannot edit it. Or (2) You cannot modify the course of an existing file',
  })
  update(
    @Param('id') id: string,
    @Body() updateFileDto: UpdateFileDto,
    @Req() req,
  ) {
    return this.filesService.update(+id, updateFileDto, req);
  }

  @UseGuards(AdminOrProfessorGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a file by ID',
    description:
      "Deletes the file that the specified id belongs to.The file is deleted only if the user is admin; or if the user is professor and the file's courseId field corresponds to a course he teaches",
  })
  @ApiOkResponse({
    description: 'The file has been successfully deleted.',
  })
  @ApiForbiddenResponse({
    description:
      'Access denied. You are not the professor that owns this file, thus you cannot delete it',
  })
  remove(@Param('id') id: string, @Req() req) {
    return this.filesService.remove(+id, req);
  }
}
