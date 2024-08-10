import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }

@Injectable()
export class ProfessorGuard extends AuthGuard('professor') { }

@Injectable()
export class AdminOrSelfGuard extends AuthGuard('adminOrSelf') { }