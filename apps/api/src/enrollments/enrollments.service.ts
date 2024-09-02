import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/enrollments.dto';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from 'src/utils/constants';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createEnrollmentDto: CreateEnrollmentDto, req: Request) {
    let decodedToken = jwt.verify(req.cookies.token, jwtSecret);
    const { id: userId, role } = decodedToken as {
      id: number;
      role: string;
    };

    if (role === 'Admin') {
      return this.prismaService.enrollment.create({
        data: createEnrollmentDto,
      });
    } else if (role === 'Student') {
      createEnrollmentDto.userId = userId;
      return this.prismaService.enrollment.create({
        data: createEnrollmentDto,
      });
    }
  }

  async findAll(req: Request, userId?: number, courseId?: number) {
    const where = {};
    let decodedToken = jwt.verify(req.cookies.token, jwtSecret);
    const { id, role } = decodedToken as {
      id: number;
      role: string;
    };

    if (userId) {
      where['userId'] = userId;
    }
    if (courseId) {
      where['courseId'] = courseId;
    }

    //Tutte le iscrizione, solo gli admin
    if (!userId && !courseId && role !== 'Admin') {
      throw new ForbiddenException(
        'Access denied. Only admins can see all the enrollments',
      );
    }

    //Iscrizioni di un singolo utente, admin oppure studenti e professori il cui id corrisponde all'userId
    if (userId && !courseId) {
      if ((role === 'Student' || role === 'Professor') && userId != id) {
        throw new ForbiddenException(
          'Access denied. You are not the owner of these enrollments',
        );
      }
    }

    //Iscrizioni di un singolo corso, admin oppure professori che tengono il corso
    if (courseId && !userId) {
      if (role === 'Student') {
        throw new ForbiddenException(
          'Access denied. Only admin and professors can see the enrollments of a course',
        );
      } else if (role === 'Professor') {
        const foundCourse = this.prismaService.course.findFirst({
          where: {
            id: courseId,
            userId: id,
          },
        });
        //console.log(await foundCourse);
        if ((await foundCourse) == null) {
          throw new ForbiddenException(
            'Access denied. You are not the ownser of this course, thus you cannot see its enrollments',
          );
        }
      }
    }

    //Iscrizione di un utente ad un corso precisa. Admin oppure studenti se l'id è il loro oppure professori se tengono il corso
    if (userId && courseId) {
      if (role === 'Student' && userId != id) {
        throw new ForbiddenException(
          "Access denied. You cannot see the details of an enrollment if you're not the owner",
        );
      } else if (role === 'Professor') {
        const foundCourse = this.prismaService.course.findFirst({
          where: {
            id: courseId,
            userId: id,
          },
        });
        if ((await foundCourse) == null) {
          throw new ForbiddenException(
            'Access denied. You are not the ownser of this course, thus you cannot see its enrollments',
          );
        }
      }
    }

    return this.prismaService.enrollment.findMany({
      where,
    });
  }

  async findOne(id: number, req: Request) {
    let decodedToken = jwt.verify(req.cookies.token, jwtSecret);
    const { id: userId, role } = decodedToken as {
      id: number;
      role: string;
    };

    if (role === 'Admin') {
      return this.prismaService.enrollment.findUnique({
        where: {
          id,
        },
      });
    } else if (role === 'Student') {
      const foundEnrollment = this.prismaService.enrollment.findUnique({
        where: {
          id,
        },
      });

      if ((await foundEnrollment).userId === userId) return foundEnrollment;
      else
        throw new ForbiddenException(
          "Access denied. You cannot see the details of an enrollment if you're not the owner",
        );
    }
  }

  //Potrebbe essere inutile, di base non c'è molto da modificare nell'iscrizione, la si cancella soltanto
  // async update(id: number, updateEnrollmentDto: Prisma.EnrollmentUpdateInput) {
  //   return this.prismaService.enrollment.update({
  //     where: {
  //       id,
  //     },
  //     data: updateEnrollmentDto,
  //   });
  // }

  async remove(id: number, req: Request) {
    let decodedToken = jwt.verify(req.cookies.token, jwtSecret);
    const { id: userId, role } = decodedToken as {
      id: number;
      role: string;
    };

    const foundEnrollment = this.prismaService.enrollment.findUnique({
      where: {
        id,
      },
    });

    console.log((await foundEnrollment).userId);
    console.log(userId);

    //questo controllo non fuzniona, un utente può eliminare le iscrizioni di altri utenti
    if (role === 'Student' && (await foundEnrollment).userId != userId) {
      throw new ForbiddenException(
        "Access denied. You cannot delete an enrollment that's not yours",
      );
    }

    return this.prismaService.enrollment.delete({
      where: {
        id,
      },
    });
  }
}
