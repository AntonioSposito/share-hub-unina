import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from 'src/utils/constants';
import { CreateFileDto, UpdateFileDto } from './dto/files.dto';

@Injectable()
export class FilesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createFileDto: CreateFileDto, req: Request) {
    let decodedToken = jwt.verify(req.cookies.token, jwtSecret);
    const { id: userId, role } = decodedToken as {
      id: number;
      role: string;
    };

    if (role === 'Admin') {
      return this.prismaService.file.create({
        data: createFileDto,
      });
    } else if (role === 'Professor') {
      // Il Professore può caricare il file solo se tiene il corso in cui lo sta caricando
      const isProfessorOfCourse = await this.prismaService.course.findFirst({
        where: {
          id: createFileDto.courseId,
          userId: userId, // Verifica che il Professore sia il docente del corso
        },
      });
      if (isProfessorOfCourse) {
        return this.prismaService.file.create({
          data: createFileDto,
        });
      } else {
        throw new ForbiddenException(
          'Access denied. You cannot upload files with a courseId of a course you are not the owner',
        );
      }
    }
  }

  async findAll(req: Request, courseId?: number) {
    // Verifica e decodifica il token JWT
    let decodedToken = jwt.verify(req.cookies.token, jwtSecret);
    const { id: userId, role } = decodedToken as {
      id: number;
      role: string;
    };

    // Se courseId è presente, controlla l'accesso basato sul ruolo
    if (courseId) {
      if (role === 'Admin') {
        // L'Admin può accedere a tutti i file del corso
        return this.prismaService.file.findMany({
          where: {
            courseId,
          },
        });
      } else if (role === 'Professor') {
        // Il Professore può accedere solo ai file dei corsi che tiene
        const isProfessorOfCourse = await this.prismaService.course.findFirst({
          where: {
            id: courseId,
            userId: userId, // Verifica che il Professore sia il docente del corso
          },
        });

        if (isProfessorOfCourse) {
          return this.prismaService.file.findMany({
            where: {
              courseId,
            },
          });
        } else {
          throw new ForbiddenException(
            'Access denied. You are not the professor of this course so you cannot see its files.',
          );
        }
      } else if (role === 'Student') {
        // Lo Studente può accedere solo ai file dei corsi a cui è iscritto
        const isEnrolledInCourse =
          await this.prismaService.enrollment.findFirst({
            where: {
              courseId,
              userId: userId, // Verifica che lo studente sia iscritto al corso
            },
          });

        if (isEnrolledInCourse) {
          return this.prismaService.file.findMany({
            where: {
              courseId,
            },
          });
        } else {
          throw new ForbiddenException(
            'Access denied. You are not enrolled in this course so you cannot see its files.',
          );
        }
      } else {
        throw new UnauthorizedException();
      }
    }

    // Se il courseId non è presente, consenti l'accesso solo agli Admin
    if (role === 'Admin') {
      return this.prismaService.file.findMany();
    } else {
      throw new ForbiddenException('Only admins can view all the files');
    }
  }

  async findOne(id: number, req: Request) {
    const decodedToken = jwt.verify(req.cookies.token, jwtSecret);
    const { id: userId, role } = decodedToken as {
      id: number;
      role: string;
    };

    // Trova il file richiesto
    const foundFile = await this.prismaService.file.findUnique({
      where: {
        id,
      },
    });

    if (!foundFile) {
      throw new UnauthorizedException('File not found.');
    }

    if (role === 'Admin') {
      return this.prismaService.file.findUnique({
        where: {
          id,
        },
      });
    } else if (role === 'Professor') {
      //Trovo il corso del file
      const foundCourse = this.prismaService.course.findUnique({
        where: {
          id: (await foundFile).courseId,
        },
      });
      //Verifico se il corso trovato è tenuto dal professore che sta cercando il file
      if ((await foundCourse).userId === userId) {
        return foundFile;
      } else {
        throw new ForbiddenException(
          'Access denied. You are not the professor that owns this file',
        );
      }
    } else if (role === 'Student') {
      //Trova l'iscrizione
      const foundEnrollment = this.prismaService.enrollment.findFirst({
        where: {
          userId: userId,
          courseId: (await foundFile).courseId,
        },
      });
      // console.log(userId);
      // console.log((await foundFile).courseId);
      // console.log((await foundEnrollment).userId);
      // console.log((await foundEnrollment).courseId);

      console.log(await foundEnrollment);

      //Verifico se trovo l'iscrizione
      if (await foundEnrollment) {
        return foundFile;
      } else {
        throw new ForbiddenException(
          'Access denied. You are not enrolled in the course this file is from',
        );
      }
    }
  }

  async update(id: number, updateFileDto: UpdateFileDto, req: Request) {
    const decodedToken = jwt.verify(req.cookies.token, jwtSecret);
    const { id: userId, role } = decodedToken as {
      id: number;
      role: string;
    };

    // Trova il file da modificare
    const foundFile = await this.prismaService.file.findUnique({
      where: {
        id,
      },
    });

    const foundCourse = this.prismaService.course.findUnique({
      where: {
        id: (await foundFile).courseId,
      },
    });

    if (updateFileDto.courseId !== foundFile.courseId) {
      throw new ForbiddenException(
        'Access denied. You cannot modify the course of an existing file',
      );
    }

    if (
      role === 'Admin' ||
      (role === 'Professor' && (await foundCourse).userId) === userId
    ) {
      return this.prismaService.file.update({
        where: {
          id,
        },
        data: updateFileDto,
      });
    } else {
      throw new ForbiddenException(
        'Access denied. You are not the professor that owns this file, thus you cannot edit it',
      );
    }
  }

  async remove(id: number, req: Request) {
    const decodedToken = jwt.verify(req.cookies.token, jwtSecret);
    const { id: userId, role } = decodedToken as {
      id: number;
      role: string;
    };

    // Trova il file da modificare
    const foundFile = await this.prismaService.file.findUnique({
      where: {
        id,
      },
    });

    const foundCourse = this.prismaService.course.findUnique({
      where: {
        id: (await foundFile).courseId,
      },
    });

    if (
      role === 'Admin' ||
      (role === 'Professor' && (await foundCourse).userId) === userId
    ) {
      return this.prismaService.file.delete({
        where: {
          id,
        },
      });
    } else {
      throw new ForbiddenException(
        'Access denied. You are not the professor that owns this file, thus you cannot delete it',
      );
    }
  }
}
