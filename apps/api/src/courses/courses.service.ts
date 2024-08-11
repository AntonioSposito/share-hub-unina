import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createCourseDto: Prisma.CourseCreateInput) {
    return this.prismaService.course.create({ data: createCourseDto });
  }

  async findAll(userId?: number) {
    if (userId) return this.prismaService.course.findMany({
      where: {
        userId,
      }
    });

    return this.prismaService.course.findMany();
  }

  async findOne(id: number) {
    return this.prismaService.course.findUnique({
      where: {
        id,
      }
    });
  }

  async update(id: number, updateCourseDto: Prisma.CourseUpdateInput) {
    return this.prismaService.course.update({
      where: {
        id,
      },
      data: updateCourseDto
    });
  }

  async remove(id: number) {
    return this.prismaService.course.delete({
      where: {
        id,
      }
    });
  }
}
