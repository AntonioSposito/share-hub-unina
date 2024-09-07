import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, RequestHandler } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from 'src/utils/constants';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    if (createUserDto.email.endsWith('@unina.it')) {
      createUserDto.isProfessor = true;
    } else if (createUserDto.email.endsWith('@studenti.unina.it')) {
      createUserDto.isProfessor = false;
    } else {
      throw new Error(
        'The email must end with "@unina.it" or "@studenti.unina.it" ',
      );
    }

    return this.prismaService.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return this.prismaService.user.findMany({
      select: { id: true, name: true, lastname: true, email: true, role: true },
    });
  }

  async findAllProfessors() {
    return this.prismaService.user.findMany({
      where: {
        role: 'Professor',
      },
      select: { id: true, name: true, lastname: true, email: true, role: true },
    });
  }

  async findOne(id: number, req: Request) {
    let decodedToken = jwt.verify(req.cookies.token, jwtSecret);
    const { id: userId, role } = decodedToken as {
      id: number;
      role: string;
    };

    const foundUser = this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: { id: true, name: true, lastname: true, email: true, role: true },
    });

    //Solo gli admin possono visualizzare le pagine di altri admin
    if ((await foundUser).role === 'Admin' && role != 'Admin') {
      throw new ForbiddenException('Access denied');
    } //I professori possono visualizzare solo le pagine di altri professori
    else if (role === 'Professor' && (await foundUser).role != 'Professor') {
      throw new ForbiddenException(
        'Access denied. Professor can view only other professors page',
      );
    } //Gli studenti possono visualizzare solo le pagine dei professori e la propria
    else if (
      role === 'Student' &&
      ((await foundUser).role == 'Admin' ||
        ((await foundUser).role == 'Student' && (await foundUser).id != userId))
    ) {
      throw new ForbiddenException(
        'Access denied. Students can view only professors pages and their own',
      );
    }

    if ((await foundUser) == null) {
      throw new NotFoundException();
    }

    return foundUser;
  }

  async update(
    id: number,
    updateUserDto: Prisma.UserUpdateInput,
    req: RequestHandler,
  ) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
