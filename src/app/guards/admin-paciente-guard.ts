import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Perfil } from '../enums/enums';
import { UsuarioService } from '../services/UsuarioService';

export const adminPacienteGuard: CanActivateFn = (route, state) => {
  const us = inject(UsuarioService);

  if (us.usuarioActual && us.usuarioActual!.perfil === Perfil.Admin || us.usuarioActual!.perfil === Perfil.Paciente) {
    console.log("Guard: Admin y Paciente: true");
    return true;
  }
  console.log("Guard: Admin y Paciente: false");
  return false;
};
