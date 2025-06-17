import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Perfil } from '../enums/enums';
import { UsuarioService } from '../services/UsuarioService';

export const adminGuard: CanActivateFn = (route, state) => {
  const us = inject(UsuarioService);

  if (us.usuarioActual && us.usuarioActual!.perfil === Perfil.Admin) {
    console.log("Admin si");
    return true;
  }
  console.log("Admin no");
  return false;
};
