import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewdto {
  @ApiProperty({
    description: 'The id of the file this reviews is for',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  fileId: number;

  @ApiProperty({
    description: 'The id of the user writing the review',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description:
      'The rating the user is giving to the file. It must be between 1 and 5',
    example: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @ApiProperty({
    description: 'The text of the review',
    example: 'I liked it',
  })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class UpdateReviewdto {
  @ApiProperty({
    description: 'The id of the file this reviews is for. It cannot be changed',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  fileId: number;

  @ApiProperty({
    description:
      'The id of the user that wrote the review. It cannot be changed',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description:
      'The new rating the user is giving to the file, must be between 1 and 5',
    example: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @ApiProperty({
    description: 'The new text of the review',
    example: 'I still like it',
  })
  @IsString()
  @IsNotEmpty()
  text: string;
}
