import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UsuarioService } from '../../../services/UsuarioService';
import { Especialista, Turno } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-turnos-especialista',
  imports: [CommonModule],
  templateUrl: './turnos-especialista.html',
  styleUrl: './turnos-especialista.css'
})
export class TurnosEspecialista {

  turnosDisponibles: Turno[] = [];
  especialista: Especialista = {};
  us = inject(UsuarioService);

  constructor() { }

  ngOnInit() {
    
    this.us.traerEspecialistaUsuarioId(this.us.usuarioActual?.id_usuario!).then(({ data, error }) => {
      console.log("Especialista: ",data);
      if (error == null) {
        this.especialista = data![0];
        this.us.traerTurnosEspecialista(this.especialista.id_especialista!).then(({ data, error }) => {
          if (error == null) {
            this.turnosDisponibles = data!;
            console.log("Turnos ", this.turnosDisponibles);
          }
        });
      }else {
        console.log("error al cargar traerEspecialistaUsuarioId");
        console.log(error);
      }

    });

  }

  completarEncuesta(turno: any) {
    console.log("completarEncuesta ", turno)
  }

  cancelarTurno(turno: any) {
    console.log("cancelarTurno ", turno)
  }

  leerResenia(turno: any) {
    console.log("leerResenia ", turno)
  }

  calificarAtencion(turno: any) {
    console.log("calificarAtencion ", turno)
  }


}
