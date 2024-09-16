import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({
    description: 'The id of the course for this file',
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  public courseId: number;

  @ApiPropertyOptional({
    description: 'The description for this file',
    example: 'This is a very long description',
  })
  @IsString()
  public description: string;

  @ApiProperty({
    description: 'The name for this file',
    example: 'Slide 1',
  })
  @IsString()
  @IsNotEmpty()
  public name: string;
}

export class UpdateFileDto {
  @ApiProperty({
    description: 'The id of the course for this file, it cannot be changed',
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  public courseId: number;

  @ApiPropertyOptional({
    description: 'The new description for this file',
    example: 'This is a very long description',
  })
  @IsString()
  public description: string;

  @ApiProperty({
    description: 'The new name for this file',
    example: 'Slide 1',
  })
  @IsString()
  @IsNotEmpty()
  public name: string;
}
