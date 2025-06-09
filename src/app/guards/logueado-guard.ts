import { CanActivateFn } from '@angular/router';

export const logueadoGuard: CanActivateFn = (route, state) => {
  return true;
};
