import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/courses.dto';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from 'src/utils/constants';

@Injectable()
export class CoursesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCourseDto: CreateCourseDto, req: Request) {
    let decodedToken;

    try {
      // Decodifica e verifica il token
      decodedToken = jwt.verify(req.cookies.token, jwtSecret);

      // Salva i valori in delle costanti usando la destrutturazione
      const { id, email, isProfessor, role } = decodedToken as {
        id: number;
        email: string;
        isProfessor: boolean;
        role: string;
      };

      //Se l'utente che sta creando il corso è professore l'userId del corso creato deve corrispondere con l'userId del professore che lo sta creando
      //Se l'utente è admin, può crearlo con l'userId che preferisce
      //Se l'utente è studente, non può arrivare a creare un corso in quanto bloccato dal guard
      if (role == 'Professor') {
        createCourseDto.userId = id;
      }
    } catch (err) {
      throw new ForbiddenException('Invalid token');
    }

    return this.prismaService.course.create({ data: createCourseDto });
  }

  async findAll(userId?: number) {
    if (userId)
      return this.prismaService.course.findMany({
        where: {
          userId,
        },
      });

    return this.prismaService.course.findMany();
  }

  async findOne(id: number) {
    return this.prismaService.course.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto, req: Request) {
    let decodedToken = jwt.verify(req.cookies.token, jwtSecret);
    const { id: userId, role } = decodedToken as {
      id: number;
      role: string;
    };

    const foundCourse = this.prismaService.course.findUnique({
      where: {
        id,
      },
    });

    if (
      role === 'Admin' ||
      (role === 'Professor' && userId === (await foundCourse).userId)
    ) {
      return this.prismaService.course.update({
        where: {
          id,
        },
        data: updateCourseDto,
      });
    } else {
      throw new ForbiddenException(
        'Only admins and the Professor owner of this course can edit it.',
      );
    }
  }

  async remove(id: number, req: Request) {
    let decodedToken = jwt.verify(req.cookies.token, jwtSecret);
    const { id: userId, role } = decodedToken as {
      id: number;
      role: string;
    };

    const foundCourse = this.prismaService.course.findUnique({
      where: {
        id,
      },
    });

    if (
      role === 'Admin' ||
      (role === 'Professor' && userId === (await foundCourse).userId)
    ) {
      return this.prismaService.course.delete({
        where: {
          id,
        },
      });
    } else {
      throw new ForbiddenException(
        'Only admins and the Professor owner of this course can delete it.',
      );
    }
  }
}
