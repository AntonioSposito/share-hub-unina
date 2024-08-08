import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, } from 'class-validator';


export class SignupDto {
	@IsEmail()
	@Matches(/@(unina\.it|studenti\.unina\.it)$/, {
		message: 'L\'email deve terminare con @unina.it o @studenti.unina.it',
	})
	public email: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	public password: string;

	@IsNotEmpty()
	public name: string

	@IsNotEmpty()
	public lastname: string
}

export class SigninDto {
	@IsEmail()
	@Matches(/@(unina\.it|studenti\.unina\.it)$/, {
		message: 'L\'email deve terminare con @unina.it o @studenti.unina.it',
	})
	public email: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	public password: string;
}