import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UsuarioService } from '../services/UsuarioService';
import { Perfil } from '../enums/enums';



export const pacienteGuard: CanActivateFn = (route, state) => {
  const us = inject(UsuarioService);
  
    if (us.usuarioActual && us.usuarioActual!.perfil === Perfil.Paciente){
      console.log("paciente si");
      return true;
    }
    console.log("paciente no");
    return false;
};
