import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateReviewdto, UpdateReviewdto } from './dto/reviews.dto';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from 'src/utils/constants';

@Injectable()
export class ReviewsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createReviewDto: CreateReviewdto, req: Request) {
    const decodedToken = jwt.verify(req.cookies.token, jwtSecret);
    const { id: userId, role } = decodedToken as {
      id: number;
      role: string;
    };

    //Se l'utente è Studente
    if (role === 'Student') {
      //Trovo il file che si vuole recensire
      const foundFile = this.prismaService.file.findUnique({
        where: {
          id: createReviewDto.fileId,
        },
      });

      //Trovo l'iscrizione dello studente al corso
      const foundEnrollment = this.prismaService.enrollment.findFirst({
        where: {
          userId: userId,
          courseId: (await foundFile).courseId,
        },
      });

      if ((await foundEnrollment) == null) {
        throw new ForbiddenException(
          'Access denied. You can only review files if you are enrolled in the course the file is from.',
        );
      }
    }

    const newReview = await this.prismaService.review.create({
      data: createReviewDto,
    });

    // Calcola la nuova media del voto per il file
    const fileId = newReview.fileId;
    const reviews = await this.prismaService.review.findMany({
      where: { fileId },
      select: { rating: true },
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Aggiorna il file con la nuova media del voto
    await this.prismaService.file.update({
      where: { id: fileId },
      data: { avgRating: averageRating },
    });

    return newReview;
  }

  async findAll(req: Request, userId?: number, fileId?: number) {
    const decodedToken = jwt.verify(req.cookies.token, jwtSecret);
    const { id: decodedUserId, role } = decodedToken as {
      id: number;
      role: string;
    };
    const where = {};

    if (userId) {
      where['userId'] = userId;
    }
    if (fileId) {
      where['fileId'] = fileId;
    }

    //Tutte le recensioni, solo gli admin
    if (!userId && !fileId && role !== 'Admin') {
      throw new ForbiddenException(
        'Access denied. Only admins can see all the reviews',
      );
    }

    //Recensioni di un singolo utente, admin oppure studenti e professori il cui id corrisponde all'userId
    if (userId && !fileId) {
      if (
        (role === 'Student' || role === 'Professor') &&
        userId != decodedUserId
      ) {
        throw new ForbiddenException(
          'Access denied. You are not the owner of these reviews',
        );
      }
    }

    //Recensioni di un singolo file, admin, oppure professori che sono i proprietari del corso di cui il file fa parte oppure studenti che sono iscritti al corso di cui il file fa parte
    if (!userId && fileId) {
      if (role === 'Professor') {
        //Trovo il file
        const foundFile = this.prismaService.file.findUnique({
          where: { id: fileId },
        });
        //Trovo il corso del file e tenuto dal professore che fa la richiesta
        const foundCourse = this.prismaService.course.findFirst({
          where: { id: (await foundFile).courseId, userId: decodedUserId },
        });

        if ((await foundCourse) == null) {
          throw new ForbiddenException(
            'Access denied. You are trying to access reviews of a file and you are not the owner of the course the file is from',
          );
        }
      } else if (role === 'Student') {
        //Trovo il file
        const foundFile = this.prismaService.file.findUnique({
          where: { id: fileId },
        });
        //Trovo iscrizione
        const foundEnrollment = this.prismaService.enrollment.findFirst({
          where: {
            courseId: (await foundFile).courseId,
            userId: decodedUserId,
          },
        });
        if ((await foundEnrollment) == null) {
          throw new ForbiddenException(
            'Access denied. You are trying to access reviews of a file from a course you are not enrolled in',
          );
        }
      }
    }

    if (userId && fileId) {
      if (role === 'Student' && userId != decodedUserId) {
        throw new ForbiddenException(
          'Access denied. You are not the owner of these reviews',
        );
      } else if (role === 'Professor') {
        //Trovo il file
        const foundFile = this.prismaService.file.findUnique({
          where: { id: fileId },
        });
        //Trovo il corso del file e tenuto dal professore che fa la richiesta
        const foundCourse = this.prismaService.course.findFirst({
          where: { id: (await foundFile).courseId, userId: decodedUserId },
        });

        if ((await foundCourse) == null) {
          throw new ForbiddenException(
            'Access denied. You are trying to access reviews of a file and you are not the owner of the course the file is from',
          );
        }
      }
    }

    return this.prismaService.review.findMany({
      where,
    });
  }

  async findOne(id: number, req: Request) {
    const decodedToken = jwt.verify(req.cookies.token, jwtSecret);
    const { id: userId, role } = decodedToken as {
      id: number;
      role: string;
    };

    const foundReview = this.prismaService.review.findUnique({
      where: {
        id,
      },
    });

    //Se l'user è professore
    if (role === 'Professor') {
      //Trovo il file relativo alla recensione
      const foundFile = this.prismaService.file.findUnique({
        where: { id: (await foundReview).fileId },
      });
      //Trovo il corso relativo al file
      const foundCouse = this.prismaService.course.findUnique({
        where: {
          id: (await foundFile).courseId,
        },
      });
      //Se il professore che vuole vedere la recensione non è il professore che tiene il corso
      if ((await foundCouse).userId != userId) {
        throw new ForbiddenException(
          'Access denied. You cannot see reviews of files that are not from one of your courses',
        );
      }
    } else if (role === 'Student') {
      if ((await foundReview).userId != userId) {
        throw new ForbiddenException(
          'Access denied. You cannot see a review you did not write',
        );
      }
    }

    return foundReview;
  }

  async update(id: number, updateReviewDto: UpdateReviewdto, req: Request) {
    const decodedToken = jwt.verify(req.cookies.token, jwtSecret);
    const { id: userId, role } = decodedToken as {
      id: number;
      role: string;
    };

    const foundReview = await this.prismaService.review.findUnique({
      where: {
        id,
      },
    });

    if (role === 'Student') {
      if (userId != updateReviewDto.userId) {
        throw new ForbiddenException(
          'Access denied. You cannot modify a review you did not write',
        );
      } else if (foundReview.fileId != updateReviewDto.fileId) {
        throw new ForbiddenException(
          'Access denied. You cannot modify the fileId of a review',
        );
      }
    }

    const updatedReview = await this.prismaService.review.update({
      where: {
        id,
      },
      data: updateReviewDto,
    });

    // Ricalcola la media del voto per il file dopo l'aggiornamento
    const fileId = updatedReview.fileId;
    const reviews = await this.prismaService.review.findMany({
      where: { fileId },
      select: { rating: true },
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Aggiorna il file con la nuova media del voto
    await this.prismaService.file.update({
      where: { id: fileId },
      data: { avgRating: averageRating },
    });

    return updatedReview;
  }

  async remove(id: number, req: Request) {
    const deletedReview = await this.prismaService.review.delete({
      where: {
        id,
      },
    });

    const decodedToken = jwt.verify(req.cookies.token, jwtSecret);
    const { id: userId, role } = decodedToken as {
      id: number;
      role: string;
    };

    if (role === 'Student' && deletedReview.userId != userId) {
      throw new ForbiddenException(
        'Access denied. You cannot delete a review you did not write',
      );
    }

    // Ricalcola la media del voto per il file dopo la rimozione
    const fileId = deletedReview.fileId;
    const reviews = await this.prismaService.review.findMany({
      where: { fileId },
      select: { rating: true },
    });

    let averageRating = 0;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );
      averageRating = totalRating / reviews.length;
    }

    // Aggiorna il file con la nuova media del voto
    await this.prismaService.file.update({
      where: { id: fileId },
      data: { avgRating: averageRating },
    });

    return deletedReview;
  }
}
