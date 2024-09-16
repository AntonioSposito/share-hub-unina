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
import { AdminOrStudentGuard, JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CreateReviewdto, UpdateReviewdto } from './dto/reviews.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('reviews')
@ApiBadRequestResponse({
  description: 'Bad request. There was something wrong with your request',
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized. You do not have access to this resource',
})
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AdminOrStudentGuard)
  @Post()
  @ApiOperation({
    summary: 'Create a new review',
    description:
      'Creating a review for the file with the specified id. A review can be created by a student only if the student is enrolled in the associated course or if the user is an admin. Each user can review each file only once.',
  })
  @ApiCreatedResponse({
    description: 'The review has been successfully created.',
  })
  @ApiForbiddenResponse({
    description:
      'Access denied. (1) You can only review a file once. or (2) You can only review files if you are enrolled in the course the file is from',
  })
  @ApiBody({ type: CreateReviewdto })
  create(@Body() createReviewDto: CreateReviewdto, @Req() req) {
    return this.reviewsService.create(createReviewDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all reviews',
    description:
      'Returns reviews, possibly filtered by the user who wrote them and/or the file they refer to. Reviews are returned if the user is admin; or if the user is a professor and the reviews are from a file that belongs to one of his courses; or if the user is a student and wrote the reviews himself',
  })
  @ApiOkResponse({
    description:
      'List of all the reviews (potentially filtered by userId and/or fileId).',
  })
  @ApiForbiddenResponse({
    description:
      'Access denied. (1) You are trying to access reviews of a file and you are not the owner of the course the file is from. or (2) You are trying to access reviews of a file from a course you are not enrolled in',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'The ID of the user to filter reviews by (optional)',
    type: String,
  })
  @ApiQuery({
    name: 'fileId',
    required: false,
    description: 'The ID of the file to filter reviews by (optional)',
    type: String,
  })
  findAll(
    @Req() req,
    @Query('userId') userId?: string,
    @Query('fileId') fileId?: string,
  ) {
    return this.reviewsService.findAll(req, +userId, +fileId);
  }

  @UseGuards(AdminOrStudentGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Get a review by id.',
    description:
      'Returns the review that the specified id belongs to. The review is returned if the user is admin; or if the user is a student and wrote the review',
  })
  @ApiOkResponse({ description: 'Review found.' })
  @ApiForbiddenResponse({
    description: 'Access denied. You cannot see a review you did not write.',
  })
  findOne(@Param('id') id: string, @Req() req) {
    return this.reviewsService.findOne(+id, req);
  }

  @UseGuards(AdminOrStudentGuard)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a review by id.',
    description:
      'Updates the information about the review that the specified id belongs to. The review is modified if the user is admin; or if the user is the student who wrote the review. The user cannot modify the file or the user the review refers to',
  })
  @ApiOkResponse({ description: 'The review has been successfully updated.' })
  @ApiForbiddenResponse({
    description:
      'Access denied. You cannot modify the fileId or the userId of a review.',
  })
  @ApiBody({ type: UpdateReviewdto })
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewdto,
    @Req() req,
  ) {
    return this.reviewsService.update(+id, updateReviewDto, req);
  }

  @UseGuards(AdminOrStudentGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a review by id.',
    description:
      'Deletes the review that the specified id belongs to.The review is deleted if the user is admin; or if the user is the student who wrote the review',
  })
  @ApiOkResponse({ description: 'The review has been successfully deleted.' })
  @ApiForbiddenResponse({
    description: 'Access denied. You cannot delete a review you did not write.',
  })
  remove(@Param('id') id: string, @Req() req) {
    return this.reviewsService.remove(+id, req);
  }
}
