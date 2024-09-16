import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @ApiProperty({
    description: 'The email of the new user',
    example: 'esempio@unina.it',
  })
  @IsEmail()
  @Matches(/@(unina\.it|studenti\.unina\.it)$/, {
    message: "L'email deve terminare con @unina.it o @studenti.unina.it",
  })
  public email: string;

  @ApiProperty({
    description:
      'The password of the new user. It must be at least 6 letters long',
    example: '******',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  public password: string;

  @ApiProperty({
    description: 'The name of the new user',
    example: 'Pippo',
  })
  @IsNotEmpty()
  public name: string;

  @ApiProperty({
    description: 'The lastname of the new user',
    example: 'CognomePippo',
  })
  @IsNotEmpty()
  public lastname: string;
}

export class SigninDto {
  @ApiProperty({
    description:
      "The email of the user. It must end with '@unina.it' or '@studenti.unina.it'",
    example: 'test@unina.it',
  })
  @IsEmail()
  @Matches(/@(unina\.it|studenti\.unina\.it)$/, {
    message: "L'email deve terminare con @unina.it o @studenti.unina.it",
  })
  public email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'test_password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  public password: string;
}
