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
import { Prisma } from '@prisma/client';
import {
  AdminGuard,
  AdminOrSelfGuard,
  JwtAuthGuard,
} from 'src/auth/jwt/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: Prisma.UserCreateInput) {
  //   return this.usersService.create(createUserDto);
  // }

  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/professors')
  findAllProfessors() {
    return this.usersService.findAllProfessors();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.usersService.findOne(id, req);
  }

  @UseGuards(AdminOrSelfGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: Prisma.UserUpdateInput,
    @Req() req,
  ) {
    return this.usersService.update(id, updateUserDto, req);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
