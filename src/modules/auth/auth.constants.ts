// JWT_SECRET is used as the secret key for signing and verifying JWT tokens.
// It should be a long, random string stored securely in environment variables.
// Example: JWT_SECRET="your-very-secure-secret-key"

import { ConfigService } from '@nestjs/config';

export class jwtConstants {
  constructor(private readonly configEnv: ConfigService) {}

  getEnv(nameEnv: string): string {
    return this.configEnv.get(nameEnv) as string;
  }

  getSecret(): string {
    return this.getEnv('JWT_SECRET');
  }

  getExpiresIn(): string {
    return this.getEnv('JWT_EXPIRES_IN');
  }
}

// export const jwtConstants = {
//   secret: new ConfigService().get('JWT_SECRET') as string,
//   expiresIn: new ConfigService().get('JWT_EXPIRES_IN') as JwtSignOptions,
// };
