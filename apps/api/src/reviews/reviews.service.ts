import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createReviewDto: Prisma.ReviewCreateInput) {
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

  async findAll(userId?: number, fileId?: number) {
    const where = {};

    if (userId) {
      where['userId'] = userId;
    }
    if (fileId) {
      where['fileId'] = fileId;
    }

    return this.prismaService.review.findMany({
      where,
    });
  }

  async findOne(id: number) {
    return this.prismaService.review.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateReviewDto: Prisma.ReviewUpdateInput) {
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

  async remove(id: number) {
    const deletedReview = await this.prismaService.review.delete({
      where: {
        id,
      },
    });

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
