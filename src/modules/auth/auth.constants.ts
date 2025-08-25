// JWT_SECRET is used as the secret key for signing and verifying JWT tokens.
// It should be a long, random string stored securely in environment variables.
// Example: JWT_SECRET="your-very-secure-secret-key"
export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'default_jwt_secret', // Fallback for development
};
