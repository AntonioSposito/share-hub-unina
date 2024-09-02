import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEnrollmentDto {
  @IsNumber()
  @IsNotEmpty()
  public courseId: number;

  @IsNumber()
  @IsNotEmpty()
  public userId: number;
}
