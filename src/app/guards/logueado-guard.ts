import { inject } from '@angular/core';
import { CanActivateFn, Router, } from '@angular/router';
import { UsuarioService } from '../services/UsuarioSercvice';
import { AuthService } from '../services/AuthService';


export const logueadoGuard: CanActivateFn = (route, state) => {
  const us = inject(UsuarioService);
  const auth = inject(AuthService);
  const router = inject(Router);
  console.log("usser type of ", typeof us.usuarioActual);
  console.log("usser", us.usuarioActual);
  console.log("usser", us.usuarioActual == null);


  if (auth.usuarioActual === null) {
    router.navigateByUrl("/login")
    return false;
  } else {
    return true;
  }
};
