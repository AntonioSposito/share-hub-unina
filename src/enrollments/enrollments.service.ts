import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createEnrollmentDto: Prisma.EnrollmentCreateInput) {
    return this.databaseService.enrollment.create({
      data: createEnrollmentDto
    });
  }

  async findAll() {
    return this.databaseService.enrollment.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.enrollment.findUnique({
      where: {
        id,
      }
    });
  }

  async update(id: number, updateEnrollmentDto: Prisma.EnrollmentUpdateInput) {
    return this.databaseService.enrollment.update({
      where: {
        id,
      },
      data: updateEnrollmentDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.enrollment.delete({
      where: {
        id,
      }
    });
  }
}
