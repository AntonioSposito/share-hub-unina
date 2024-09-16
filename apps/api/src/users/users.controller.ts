import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AdminGuard,
  AdminOrSelfGuard,
  JwtAuthGuard,
} from 'src/auth/jwt/jwt.guard';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/users.dto';

@ApiTags('users')
@ApiBadRequestResponse({
  description: 'Bad request. There was something wrong with your request',
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized. You do not have access to this resource',
})
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AdminGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all the users',
    description: 'Returns the list of all users',
  })
  @ApiOkResponse({ description: 'List of all the users' })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/professors')
  @ApiOperation({
    summary: 'Get all the professors',
    description: 'Returns the list of all professors',
  })
  @ApiOkResponse({ description: 'List of all the professors' })
  findAllProfessors() {
    return this.usersService.findAllProfessors();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description:
      'Returns the details of the user to whom the specified id belongs. Admins can view all user pages, professors and students can only view the pages related to all professors plus their own page',
  })
  @ApiOkResponse({ description: 'User found' })
  @ApiForbiddenResponse({
    description:
      'Forbidden. Students can view only professors pages and their own.',
  })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.usersService.findOne(id, req);
  }

  @UseGuards(AdminOrSelfGuard)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update user by ID',
    description:
      'Updates the information about the user the specified id belongs to',
  })
  @ApiOkResponse({ description: 'The user has been successfully updated' })
  @ApiBody({ type: UpdateUserDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    return this.usersService.update(id, updateUserDto, req);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user by ID',
    description: 'Deletes the user that owns the specified id',
  })
  @ApiOkResponse({ description: 'The user has been successfully deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
