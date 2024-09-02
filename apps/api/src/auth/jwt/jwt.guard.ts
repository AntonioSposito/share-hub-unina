import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class ProfessorGuard extends AuthGuard('professor') {}

@Injectable()
export class AdminOrSelfGuard extends AuthGuard('adminOrSelf') {}

@Injectable()
export class AdminOrStudentGuard extends AuthGuard('adminOrStudent') {}

@Injectable()
export class AdminOrProfessorGuard extends AuthGuard('adminOrProfessor') {}

@Injectable()
export class AdminGuard extends AuthGuard('admin') {}
