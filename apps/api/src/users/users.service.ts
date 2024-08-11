import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createUserDto: Prisma.UserCreateInput) {
    if (createUserDto.email.endsWith("@unina.it")) {
      createUserDto.isProfessor = true;
    } else if (createUserDto.email.endsWith("@studenti.unina.it")) {
      createUserDto.isProfessor = false;
    } else {
      throw new Error("The email must end with \"@unina.it\" or \"@studenti.unina.it\" ");
    }

    return this.prismaService.user.create({
      data: createUserDto
    });
  }

  async findAll() {
    return this.prismaService.user.findMany({ select: { id: true, email: true, isProfessor: true } });
  }

  async findOne(id: number, req: Request) {
    const user = this.prismaService.user.findUnique({
      where: {
        id,
      }, select: { id: true, email: true, isProfessor: true, role: true }
    });

    if (!user) {
      throw new NotFoundException;
    }

    return user
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserDto
    });
  }

  async remove(id: number) {
    return this.prismaService.user.delete({
      where: {
        id,
      }
    });
  }
}
