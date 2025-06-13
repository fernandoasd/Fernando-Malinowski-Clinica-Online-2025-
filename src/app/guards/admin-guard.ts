import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Perfil } from '../enums/enums';
import { UsuarioService } from '../services/UsuarioSercvice';

export const adminGuard: CanActivateFn = (route, state) => {
  const us = inject(UsuarioService);
  
    if (us.usuarioActual!.perfil === Perfil.Admin){
      return true;
    }
    return false;
};
