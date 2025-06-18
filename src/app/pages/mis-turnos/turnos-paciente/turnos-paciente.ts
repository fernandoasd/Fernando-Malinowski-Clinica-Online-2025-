import { Component, inject } from '@angular/core';
import { Turno, Paciente, Especialista } from '../../../interfaces/interfaces';
import { UsuarioService } from '../../../services/UsuarioService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-turnos-paciente',
  imports: [CommonModule],
  templateUrl: './turnos-paciente.html',
  styleUrl: './turnos-paciente.css'
})
export class TurnosPaciente {

  
  turnosDisponibles: any[] = [];
  tuplaTurnosPacientes: [Turno, Paciente] = [{},{}];
  paciente: Paciente = {};
  us = inject(UsuarioService);

  constructor() { }

  ngOnInit() {
    
    this.us.traerPacienteUsuarioId(this.us.usuarioActual?.id_usuario!).then(({ data, error }) => {
      console.log("Paciente: ",data);
      if (error == null) {
        this.paciente = data![0];
        this.us.traerTurnosPaciente(this.paciente.id_paciente!).then(({ data, error }) => {
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

  aceptarTurno(turno: any){
    console.log("aceptarTurno ", turno)
  }

  rechazarTurno(turno: any){
    console.log("rechazarTurno ", turno)
  }

  finalizarTurno(turno: any){
    console.log("rechazarTurno ", turno)

  }
}
