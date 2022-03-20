import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Role } from '../roles/roles.enum';
import { Roles } from './roles.decorator';
import { RolesGuard } from 'src/guards/rules.guard';

export const Authorize = (role?: Role) =>
  applyDecorators(Roles(role), UseGuards(AuthGuard('jwt'), RolesGuard));
