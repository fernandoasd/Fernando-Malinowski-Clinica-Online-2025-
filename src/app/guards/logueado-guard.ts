import { inject } from '@angular/core';
import { CanActivateFn, Router, } from '@angular/router';
import { UsuarioService } from '../services/UsuarioService';
import { AuthService } from '../services/AuthService';


export const logueadoGuard: CanActivateFn = (route, state) => {
  const us = inject(UsuarioService);
  const auth = inject(AuthService);
  const router = inject(Router);

  if (us.usuarioActual == null) {
    router.navigateByUrl("/login")
    return false;
  } else {
    return true;
  }
};
