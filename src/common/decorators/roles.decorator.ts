export type Role = 'karyawan' | 'admin';

import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<Role[]>();
