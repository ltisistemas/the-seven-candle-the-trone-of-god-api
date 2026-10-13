import { Body, Controller, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../common/validation/zod-validation.pipe';
import { AuthService } from './application/auth.service';
import { loginSchema, registerSchema } from './application/auth.schemas';
import { LoginDto } from './application/dto/login.dto';
import { RegisterDto } from './application/dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body(new ZodValidationPipe(registerSchema)) input: RegisterDto) {
    return this.auth.register(input);
  }

  @Post('login')
  login(@Body(new ZodValidationPipe(loginSchema)) input: LoginDto) {
    return this.auth.login(input);
  }
}