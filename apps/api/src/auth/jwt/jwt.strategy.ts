import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { jwtSecret } from 'src/utils/constants';
import { Request } from 'express';
import { Role } from '../dto/auth.roles';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				JwtStrategy.extractJWT,
			]),
			secretOrKey: jwtSecret,
		});
	}

	//Estraggo token jwt
	private static extractJWT(req: Request): string | null {
		if (req.cookies && 'token' in req.cookies) {
			return req.cookies.token;
		}
		return null;
	}

	async validate(payload: { id: string; email: string; isProfessor: boolean }) {
		return payload;
	}
}



@Injectable()
export class ProfessorStrategy extends PassportStrategy(Strategy, 'professor') {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				ProfessorStrategy.extractJWT,
			]),
			secretOrKey: jwtSecret,
		});
	}

	//Estraggo token jwt
	private static extractJWT(req: Request): string | null {
		// const userId = req.params.userId
		// console.log(userId)
		if (req.cookies && 'token' in req.cookies) {
			return req.cookies.token;
		}
		return null;
	}

	async validate(payload: { id: string; email: string; isProfessor: boolean, role: string }) {
		// console.log(payload.role)
		return payload.role === Role.Professor;
	}

}

@Injectable()
export class AdminOrSelfStrategy extends PassportStrategy(Strategy, 'adminOrSelf') {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				AdminOrSelfStrategy.extractJWT,
			]),
			secretOrKey: jwtSecret,
			passReqToCallback: true,
		});
	}

	//Estraggo token jwt
	private static extractJWT(req: Request): string | null {
		// const id = req.params.id
		// console.log(id)
		if (req.cookies && 'token' in req.cookies) {
			return req.cookies.token;
		}
		return null;
	}

	async validate(req: Request, payload: { id: string; email: string; isProfessor: boolean, role: string }) {
		console.log(payload.role + " " + payload.id)
		console.log(req.params.id)

		if (!req.params.id)
			throw new NotFoundException

		return payload.role === Role.Admin || payload.id == req.params.id;
	}

}