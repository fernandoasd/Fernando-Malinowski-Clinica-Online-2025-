import { inject } from '@angular/core';
import { CanActivateFn} from '@angular/router';
import { UsuarioService } from '../services/UsuarioService';
import { Perfil } from '../enums/enums';


export const especialistaGuard: CanActivateFn = (route, state) => {
  const us = inject(UsuarioService);
  
    if (us.usuarioActual && us.usuarioActual!.perfil === Perfil.Especialista){
      return true;
    }
    return false;
};