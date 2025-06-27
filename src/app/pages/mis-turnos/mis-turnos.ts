import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UsuarioService } from '../../services/UsuarioService';
import { Perfil } from '../../enums/enums';

@Component({
  selector: 'app-mis-turnos',
  imports: [RouterOutlet],
  templateUrl: './mis-turnos.html',
  styleUrl: './mis-turnos.css'
})
export class MisTurnos {
  us = inject(UsuarioService)

  constructor (private router: Router){

  }

  ngOnInit(){
    if (this.us.usuarioActual){
      if (this.us.usuarioActual.perfil === Perfil.Paciente){
        this.router.navigate(["mis-turnos/paciente"]);
      } else if (this.us.usuarioActual.perfil === Perfil.Especialista){
        this.router.navigate(["mis-turnos/especialista"]);
      }
    }
  }
}
