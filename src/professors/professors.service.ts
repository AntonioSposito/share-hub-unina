import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProfessorsService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createProfessorDto: Prisma.ProfessorCreateInput) {
    return this.databaseService.professor.create({ data: createProfessorDto })
  }

  async findAll() {
    return this.databaseService.professor.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.professor.findUnique({
      where: {
        id,
      }
    });
  }

  async update(id: number, updateProfessorDto: Prisma.ProfessorUpdateInput) {
    return this.databaseService.professor.update({
      where: {
        id,
      },
      data: updateProfessorDto,
    });
  }

  remove(id: number) {
    return this.databaseService.professor.delete({
      where: {
        id,
      }
    });
  }
}
