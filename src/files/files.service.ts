import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FilesService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createFileDto: Prisma.FileCreateInput) {
    return this.databaseService.file.create({
      data: createFileDto
    });
  }

  async findAll(courseId?: number) {
    if (courseId) return this.databaseService.file.findMany({
      where: {
        courseId,
      }
    })

    return this.databaseService.file.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.file.findUnique({
      where: {
        id,
      }
    });
  }

  async update(id: number, updateFileDto: Prisma.FileUpdateInput) {
    return this.databaseService.file.update({
      where: {
        id,
      },
      data: updateFileDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.file.delete({
      where: {
        id,
      }
    });
  }
}
