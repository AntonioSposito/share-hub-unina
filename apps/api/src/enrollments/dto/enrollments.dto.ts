import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty({
    description: 'The id of the course for this enrollment',
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  public courseId: number;

  @ApiProperty({
    description: 'The id of the user for this enrollment',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  public userId: number;
}
