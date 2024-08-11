import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createEnrollmentDto: Prisma.EnrollmentCreateInput) {
    return this.prismaService.enrollment.create({
      data: createEnrollmentDto
    });
  }

  async findAll(userId?: number, courseId?: number) {
    const where = {};

    if (userId) { where['studentId'] = userId; }
    if (courseId) { where['courseId'] = courseId; }

    return this.prismaService.enrollment.findMany({
      where,
    });
  }

  async findOne(id: number) {
    return this.prismaService.enrollment.findUnique({
      where: {
        id,
      }
    });
  }

  async update(id: number, updateEnrollmentDto: Prisma.EnrollmentUpdateInput) {
    return this.prismaService.enrollment.update({
      where: {
        id,
      },
      data: updateEnrollmentDto,
    });
  }

  async remove(id: number) {
    return this.prismaService.enrollment.delete({
      where: {
        id,
      }
    });
  }
}
