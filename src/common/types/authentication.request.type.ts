import { Request } from 'express';

export type AuthenticationRequest = Request & {
  /**
   * The authenticated user object attached by authentication middleware.
   * Contains user identification and authorization details.
   */
  user?: {
    sub: string;
    username: string;
    role: string;
    iat: string;
    exp: string;
    // Add other relevant user properties as needed
  };
};
