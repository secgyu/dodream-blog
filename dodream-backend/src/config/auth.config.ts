import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  adminEmail: process.env.ADMIN_EMAIL ?? 'admin@admin.com',
  adminPassword: process.env.ADMIN_PASSWORD ?? '12341234',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? 'default-access-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'default-refresh-secret',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
}));
