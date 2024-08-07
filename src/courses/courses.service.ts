import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CoursesService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createCourseDto: Prisma.CourseCreateInput) {
    return this.databaseService.course.create({ data: createCourseDto });
  }

  async findAll(profId?: number) {
    if (profId) return this.databaseService.course.findMany({
      where: {
        profId,
      }
    });

    return this.databaseService.course.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.course.findUnique({
      where: {
        id,
      }
    });
  }

  async update(id: number, updateCourseDto: Prisma.CourseUpdateInput) {
    return this.databaseService.course.update({
      where: {
        id,
      },
      data: updateCourseDto
    });
  }

  async remove(id: number) {
    return this.databaseService.course.delete({
      where: {
        id,
      }
    });
  }
}
