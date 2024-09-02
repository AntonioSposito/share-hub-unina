import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  public description: string;

  @IsNumber()
  @IsNotEmpty()
  public userId: number;
}

export class UpdateCourseDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  public description: string;

  @IsNumber()
  public userId: number;
}
