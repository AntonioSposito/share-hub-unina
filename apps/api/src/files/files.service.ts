import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createFileDto: Prisma.FileCreateInput) {
    return this.prismaService.file.create({
      data: createFileDto
    });
  }

  async findAll(courseId?: number) {
    if (courseId) return this.prismaService.file.findMany({
      where: {
        courseId,
      }
    })

    return this.prismaService.file.findMany();
  }

  async findOne(id: number) {
    return this.prismaService.file.findUnique({
      where: {
        id,
      }
    });
  }

  async update(id: number, updateFileDto: Prisma.FileUpdateInput) {
    return this.prismaService.file.update({
      where: {
        id,
      },
      data: updateFileDto,
    });
  }

  async remove(id: number) {
    return this.prismaService.file.delete({
      where: {
        id,
      }
    });
  }
}
