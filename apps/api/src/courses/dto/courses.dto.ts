import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'The title of the course',
    example: 'Biomeccanica quantistica 3',
  })
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiPropertyOptional({
    description: 'The description of the course',
    example: "Corso difficilissimo che passano solo 2 persone all'anno",
  })
  @IsString()
  public description: string;

  @ApiProperty({ description: 'The ID of the professor', example: 5 })
  @IsNumber()
  @IsNotEmpty()
  public userId: number;
}

export class UpdateCourseDto {
  @ApiProperty({
    description: 'The new title of the course',
    example: 'Biomeccanica quantistica 3',
  })
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiPropertyOptional({
    description: 'The new description of the course',
    example: "Corso difficilissimo che passano solo una persona all'anno",
  })
  @IsString()
  public description: string;

  @ApiProperty({ description: 'The ID of the new professor', example: 5 })
  @IsNumber()
  public userId: number;
}
