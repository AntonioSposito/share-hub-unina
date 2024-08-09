import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { jwtSecret } from 'src/utils/constants';

export class AuthHelpers {
	constructor(private readonly jwtService: JwtService) { }
	//-------------------------HELPER FUNCTIONS-----------------------------
	async hashPassword(password: string) {
		const saltOrRound = 10;
		return await bcrypt.hash(password, saltOrRound)
	}

	async comparePasswords(args: { password: string, hash: string }) {
		return await bcrypt.compare(args.password, args.hash)
	}

	async signToken(args: { id: number, email: string, isProfessor: boolean }) {
		const payload = args
		return this.jwtService.signAsync(payload, { secret: jwtSecret })
	}
}