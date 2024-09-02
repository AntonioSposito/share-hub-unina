import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFileDto {
  @IsNumber()
  @IsNotEmpty()
  public courseId: number;

  @IsString()
  public description: string;

  @IsString()
  @IsNotEmpty()
  public name: string;
}

export class UpdateFileDto {
  @IsNumber()
  @IsNotEmpty()
  public courseId: number;

  @IsString()
  public description: string;

  @IsString()
  @IsNotEmpty()
  public name: string;
}
