import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SigninDto, SignupDto } from './dto/auth.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/constants';
import { Request, Response } from 'express';
import { Role } from './dto/auth.roles';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    //private readonly authHelpers: AuthHelpers //questo fa incazzare tutto
  ) {}

  async signup(createUserDto: SignupDto) {
    const { email, password, name, lastname } = createUserDto;
    const foundUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (foundUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    const isProfessor = createUserDto.email.endsWith('@unina.it');

    await this.prismaService.user.create({
      data: {
        email,
        hashedPassword,
        name,
        lastname,
        isProfessor,
        role: isProfessor ? Role.Professor : Role.Student,
      },
    });

    return { message: 'signup was successfull' };
  }

  async signin(loginUserDto: SigninDto, res: Response) {
    const { email, password } = loginUserDto;

    const foundUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!foundUser) {
      throw new BadRequestException('Wrong credentials');
    }

    const isMatch = await this.comparePasswords({
      password,
      hash: foundUser.hashedPassword,
    });
    if (!isMatch) {
      throw new BadRequestException('Wrong credentials');
    }

    const token = await this.signToken({
      id: foundUser.id,
      email: foundUser.email,
      isProfessor: foundUser.isProfessor,
      role: foundUser.role,
    });
    if (!token) {
      throw new ForbiddenException("Can't sign the token");
    }

    res.cookie('token', token);

    return res.send({
      message: 'logged in successfuly',
      user: {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        lastname: foundUser.lastname,
        role: foundUser.role,
      },
    });
  }

  async signout(res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'logged out successfully' });
  }

  //-------------------------HELPER FUNCTIONS-----------------------------
  async hashPassword(password: string) {
    const saltOrRound = 10;
    return await bcrypt.hash(password, saltOrRound);
  }

  async comparePasswords(args: { password: string; hash: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }

  async signToken(args: {
    id: number;
    email: string;
    isProfessor: boolean;
    role: string;
  }) {
    const payload = args;
    return this.jwtService.signAsync(payload, {
      secret: jwtSecret,
      expiresIn: '30m',
    });
  }
}
