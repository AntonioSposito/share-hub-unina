import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createReviewDto: Prisma.ReviewCreateInput) {
    return this.prismaService.review.create({
      data: createReviewDto
    });
  }

  async findAll(userId?: number, fileId?: number) {
    const where = {};

    if (userId) { where['studentId'] = userId; }
    if (fileId) { where['fileId'] = fileId; }

    return this.prismaService.review.findMany({
      where,
    });
  }

  async findOne(id: number) {
    return this.prismaService.review.findUnique({
      where: {
        id,
      }
    });
  }

  async update(id: number, updateReviewDto: Prisma.ReviewUpdateInput) {
    return this.prismaService.review.update({
      where: {
        id,
      },
      data: updateReviewDto,
    });
  }

  async remove(id: number) {
    return this.prismaService.review.delete({
      where: {
        id,
      }
    });
  }
}
