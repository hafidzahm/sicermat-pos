import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().min(1, { message: 'Username required' }),
  password: z.string().min(1, { message: 'Password required' }),
  role: z.enum(['karyawan', 'admin'], { message: 'Role required' }),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
