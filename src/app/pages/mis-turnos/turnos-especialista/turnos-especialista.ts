import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UsuarioService } from '../../../services/UsuarioService';
import { Especialista, Paciente, Turno } from '../../../interfaces/interfaces';
import { EstadoTurno } from '../../../enums/enums';
import { AlertService } from '../../../services/alert-service';

@Component({
  selector: 'app-turnos-especialista',
  imports: [CommonModule],
  templateUrl: './turnos-especialista.html',
  styleUrl: './turnos-especialista.css'
})
export class TurnosEspecialista {

  turnosDisponibles: any[] = [];
  tuplaTurnosPacientes: [Turno, Paciente] = [{}, {}];
  especialista: Especialista = {};
  us = inject(UsuarioService);
  alert = inject(AlertService);

  constructor() { }

  ngOnInit() {

    this.us.traerEspecialistaUsuarioId(this.us.usuarioActual?.id_usuario!).then(({ data, error }) => {
      console.log("Especialista: ", data);
      if (error == null) {
        this.especialista = data![0];
        this.us.traerTurnosEspecialista(this.especialista.id_especialista!).then(({ data, error }) => {
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

  aceptarTurno(turno: any) {
    let nuevoTurno = structuredClone(turno);
    nuevoTurno.estado = EstadoTurno.Aceptado;
    delete nuevoTurno.especialistas;
    delete nuevoTurno.pacientes;
    console.log("nuevoTurno: ", nuevoTurno)
    console.log("turno: ", turno)

    this.us.actualizarTurno(nuevoTurno).then(({ data, error }) => {
      if (error == null) {
        turno.estado = EstadoTurno.Aceptado;
        console.log("turno aceptado: ", turno)
      }
    })
  }

  rechazarTurno(turno: any) {
    console.log("rechazarTurno ", turno)
  }

  finalizarTurno(turno: any) {
    console.log("rechazarTurno ", turno);
    this.alert.enviarResenia().then((data) => {
      if (data.length > 0) {
        let nuevoTurno = structuredClone(turno);
        delete nuevoTurno.especialistas;
        delete nuevoTurno.pacientes;
        nuevoTurno = nuevoTurno as Turno;
        nuevoTurno.resenia = { resenia: data[0], diagnostico: data[1] }
        nuevoTurno.estado = EstadoTurno.Finalizado;
        this.us.actualizarTurno(nuevoTurno).then(({ data, error }) => {
          if (error == null) {
            turno.estado = EstadoTurno.Finalizado;
            console.log("resenia enviada: ", turno)
          }
        })
      }

    });
  }


}
