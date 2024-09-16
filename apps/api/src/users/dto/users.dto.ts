import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The new email of the user',
    example: 'esempio@unina.it',
  })
  @IsEmail()
  @Matches(/@(unina\.it|studenti\.unina\.it)$/, {
    message: "L'email deve terminare con @unina.it o @studenti.unina.it",
  })
  public email: string;

  @ApiProperty({
    description: 'The new name of the user',
    example: 'Pippo',
  })
  @IsNotEmpty()
  public name: string;

  @ApiProperty({
    description: 'The new lastname of the user',
    example: 'CognomePippo',
  })
  @IsNotEmpty()
  public lastname: string;
}
