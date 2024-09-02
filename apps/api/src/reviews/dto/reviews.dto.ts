import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewdto {
  @IsNumber()
  @IsNotEmpty()
  fileId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  text: string;
}

export class UpdateReviewdto {
  @IsNumber()
  @IsNotEmpty()
  fileId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  text: string;
}
