import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY, UserRepository } from '../../users/domain/user.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly jwt: JwtService,
  ) {}

  async register(input: RegisterDto) {
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await this.users.createWithInitialProgress(input.email.toLowerCase(), passwordHash);
    return { user: this.toPublicUser(user), accessToken: await this.signToken(user.id, user.email) };
  }

  async login(input: LoginDto) {
    const user = await this.users.findByEmail(input.email.toLowerCase());
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    return { user: this.toPublicUser(user), accessToken: await this.signToken(user.id, user.email) };
  }

  private signToken(userId: string, email: string): Promise<string> {
    return this.jwt.signAsync({ sub: userId, email });
  }

  private toPublicUser(user: { id: string; email: string; currentLevel: number; createdAt: Date }) {
    return { id: user.id, email: user.email, currentLevel: user.currentLevel, createdAt: user.createdAt };
  }
}