import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class StudentsService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createStudentDto: Prisma.StudentCreateInput) {
    return this.databaseService.student.create({ data: createStudentDto });
  }

  async findAll() {
    return this.databaseService.student.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.student.findUnique({
      where: {
        id,
      }
    });
  }

  async update(id: number, updateStudentDto: Prisma.StudentUpdateInput) {
    return this.databaseService.student.update({
      where: {
        id,
      },
      data: updateStudentDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.student.delete({
      where: {
        id,
      }
    });
  }
}
