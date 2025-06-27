import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UsuarioService } from '../../../services/UsuarioService';
import { Especialista, Paciente, Turno } from '../../../interfaces/interfaces';
import { EstadoTurno } from '../../../enums/enums';
import { AlertService } from '../../../services/alert-service';
import Swal from 'sweetalert2';
import { HistorialMedico } from '../../../components/historial-medico/historial-medico';

@Component({
  selector: 'app-turnos-especialista',
  imports: [CommonModule, HistorialMedico],
  templateUrl: './turnos-especialista.html',
  styleUrl: './turnos-especialista.css'
})
export class TurnosEspecialista {

  turnosDisponibles: any[] = [];
  tuplaTurnosPacientes: [Turno, Paciente] = [{}, {}];
  especialista: Especialista = {};
  banderaHistorial = false;
  turnoHistoriaClinica: Turno = {};
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

  rechazarTurno(turno: any) {
    let nuevoTurno = structuredClone(turno);
    nuevoTurno.estado = EstadoTurno.Rechazado;
    delete nuevoTurno.especialistas, nuevoTurno.pacientes;

    this.us.actualizarTurno(nuevoTurno).then(({ data, error }) => {
      if (error == null) {
        turno.estado = EstadoTurno.Rechazado;
      }
    })
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
            turno.resenia = nuevoTurno.resenia;
            console.log("resenia enviada: ", turno)
          }
        })
      }

    });
  }
  customC() {
    this.alert.custom();
  }

  verHistoriaClinica(turno: any) {
    this.turnoHistoriaClinica = turno;
    this.banderaHistorial = true
  }

  leerResenia(turno: any) {
    this.alert.leerResenia(turno.resenia.resenia, turno.resenia.diagnostico);
  }

  agregarDatoDinamico() {

  }

  modificarHC(turnoModif: any) {
    let index = this.turnosDisponibles.findIndex(t => t.id === turnoModif.id)
    if (index) {
      this.turnosDisponibles[index] = turnoModif;
      let turnoCopia = { ...turnoModif };
      delete turnoCopia.especialistas;
      delete turnoCopia.pacientes;
      console.log("turnoCopia: ", turnoCopia);
      this.us.actualizarTurno(turnoCopia).then(({ data, error }) => {
        if (error == null) {
          Swal.fire("", "Turno actualizado correctamente", 'success');
        } else {
          Swal.fire("", "No se pudo actualizar el turno, Error: " + error.message, 'error')
        }
      });
    }
    this. cerrarHC();
  }

  cerrarHC() {
    this.banderaHistorial = !this.banderaHistorial;
  }

}
