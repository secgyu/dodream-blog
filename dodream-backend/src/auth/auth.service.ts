import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  login(loginDto: LoginDto) {
    const adminEmail = this.configService.get<string>('auth.adminEmail');
    const adminPassword = this.configService.get<string>('auth.adminPassword');

    if (loginDto.email !== adminEmail || loginDto.password !== adminPassword) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    return this.generateTokens(loginDto.email);
  }

  refresh(email: string) {
    return this.generateTokens(email);
  }

  private generateTokens(email: string) {
    const accessPayload = { sub: 'admin', email, type: 'access' };
    const refreshPayload = { sub: 'admin', email, type: 'refresh' };

    const accessSecret =
      this.configService.get<string>('auth.jwtAccessSecret') ?? 'fallback';
    const refreshSecret =
      this.configService.get<string>('auth.jwtRefreshSecret') ?? 'fallback';

    const accessToken = this.jwtService.sign(accessPayload, {
      secret: accessSecret,
      expiresIn: 900,
    });

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: refreshSecret,
      expiresIn: 604800,
    });

    return { accessToken, refreshToken };
  }

  getCookieOptions(isProduction: boolean) {
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict' as const,
      path: '/',
    };
  }
}
