import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Prisma } from '@prisma/client';
import { AdminOrStudentGuard, JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CreateReviewdto, UpdateReviewdto } from './dto/reviews.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AdminOrStudentGuard)
  @Post()
  create(@Body() createReviewDto: CreateReviewdto, @Req() req) {
    return this.reviewsService.create(createReviewDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Req() req,
    @Query('userId') userId?: string,
    @Query('fileId') fileId?: string,
  ) {
    return this.reviewsService.findAll(req, +userId, +fileId);
  }

  @UseGuards(AdminOrStudentGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.reviewsService.findOne(+id, req);
  }

  @UseGuards(AdminOrStudentGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewdto,
    @Req() req,
  ) {
    return this.reviewsService.update(+id, updateReviewDto, req);
  }

  @UseGuards(AdminOrStudentGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.reviewsService.remove(+id, req);
  }
}
