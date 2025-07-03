import { Component, inject } from '@angular/core';
import { Turno, Paciente, Especialista } from '../../../interfaces/interfaces';
import { UsuarioService } from '../../../services/UsuarioService';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../services/alert-service';
import { EstadoTurno } from '../../../enums/enums';
import { TurnosPipe } from '../../../pipes/turnos-pipe';
import { FormsModule } from '@angular/forms';
import { LetrasMayusculasPipe } from '../../../pipes/letras-mayusculas-pipe';

@Component({
  selector: 'app-turnos-paciente',
  imports: [CommonModule, TurnosPipe, FormsModule, LetrasMayusculasPipe],
  templateUrl: './turnos-paciente.html',
  styleUrl: './turnos-paciente.css'
})
export class TurnosPaciente {


  turnosDisponibles: any[] = [];
  tuplaTurnosPacientes: [Turno, Paciente] = [{}, {}];
  paciente: Paciente = {};
  us = inject(UsuarioService);
  alert = inject(AlertService);
  filtro: string = "";


  constructor() { }

  ngOnInit() {
    this.us.traerPacienteUsuarioId(this.us.usuarioActual?.id_usuario!).then(({ data, error }) => {
      console.log("Paciente: ", data);
      if (error == null) {
        this.paciente = data![0];
        console.log("paciente: ", this.paciente);
        this.us.traerTurnosPaciente(this.paciente.id_paciente!).then(({ data, error }) => {
          if (error == null) {
            this.turnosDisponibles = data!;
            console.log("Turnos ", this.turnosDisponibles);
          }
        });
      } else {
        console.log("error al cargar traerEspecialistaUsuarioId");
        console.log(error);
      }
    });
  }

  cancelarTurno(turno: any) {
    let nuevoTurno = structuredClone(turno);
    nuevoTurno.estado = EstadoTurno.Cancelado;
    delete nuevoTurno.especialistas, nuevoTurno.pacientes;

    this.us.actualizarTurno(nuevoTurno).then(({ data, error }) => {
      if (error == null) {
        turno.estado = EstadoTurno.Cancelado;
      }
    })
  }

  leerResenia(turno: any) {
    this.alert.leerResenia(turno.resenia.resenia, turno.resenia.diagnostico);
  }

  calificarAtencion(turno: any) {
    console.log("calificarAtencion ", turno)
  }

  completarEncuesta(turno: any) {
    console.log("completarEncuesta ", turno)
  }

}
