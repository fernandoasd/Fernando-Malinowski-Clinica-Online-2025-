import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../services/UsuarioService';
import { CommonModule } from '@angular/common';
import { Disponibilidad, Especialista, Paciente, Turno } from '../../../interfaces/interfaces';
import { DiaSemana, EstadoTurno } from '../../../enums/enums';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-disponibilidad-medico',
  imports: [CommonModule],
  templateUrl: './disponibilidad-medico.html',
  styleUrl: './disponibilidad-medico.css'
})
export class DisponibilidadMedico {
  us = inject(UsuarioService);
  id_medico = -1;
  especialidad = "";
  pacienteActual: Paciente | null = null;
  especialista: Especialista = {}
  fechasDisponibles: string[] = [];
  disponibilidadMedico: Disponibilidad[] = [];
  diasDisponiblesEspecialidad: string[] = [];
  FechasDisponiblesEspecialidad: string[] = [];
  diasSemana: any[] = [];
  turnosPorEspecialista: Turno[] = []
  idPacienteElegido: number = 0;


  datosDinamicos?: Array<{
    dia_semana: DiaSemana;
    horario_inicio: string;
    horario_fin: string;
  }>;

  constructor(private route: ActivatedRoute) {
    console.log("route: ", this.route),
      this.route.queryParams.subscribe(params => {
        // this.especialista = this.us.tr
        console.log("params: ", params);
        this.id_medico = params["id"];
        this.especialidad = params["esp"];
        this.idPacienteElegido = params["paciente"];
        this.actualizarEspecialista(this.id_medico);
      })
  }

  async ngOnInit() {
    console.log("on init...");
    console.log("id medico: ", this.id_medico);
    console.log("this.especialidad: ", this.especialidad);
    console.log("this.idPacienteElegido: ", this.idPacienteElegido);
    this.us.traerPacienteUsuarioId(this.idPacienteElegido).then(({ data, error }) => {
      if (error == null) {
        this.pacienteActual = data![0];
        this.us.traerTurnosEspecialista(this.id_medico).then(({ data, error }) => {
          if (error == null) {
            this.turnosPorEspecialista = data!;
            console.log("turnosPorEspecialista:", this.turnosPorEspecialista);
          }


        })
      }
      console.log("turnosPorEspecialista:", this.turnosPorEspecialista);

    });
    console.log("especialidades: ", this.especialista.especialidades);
    this.disponibilidadMedico = await this.traerDisponibilidad(this.id_medico, this.especialidad);
    if (this.disponibilidadMedico.length > 0) {
      this.diasDisponiblesEspecialidad = this.extraerDias(this.disponibilidadMedico);
      this.FechasDisponiblesEspecialidad = this.obtenerFechasDisponibles(this.diasDisponiblesEspecialidad);
      this.diasSemana = this.obtenerFechasDisponiblesDos(this.disponibilidadMedico);
    }

    console.log("this.diasSemana: ", this.diasSemana);
    console.log("this.diasDisponiblesEspecialidad", this.diasDisponiblesEspecialidad);
    setTimeout(() => {
      console.log("id: ", this.id_medico);
      console.log("especialidades: ", this.especialista.especialidades);
      console.log("Disponibilidad medico: ", this.disponibilidadMedico);
    },)
  }


  obtenerFechasDisponiblesDos(disponibilidades: Disponibilidad[], cantidad: number = 14) {
    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const fechas = [];
    const hoy = new Date();
    const disponibilidad = disponibilidades[0];
    let days = 1;
    hoy.setDate(hoy.getDate() + days); // empezar desde mañana
    let fechaActual = new Date(hoy);
    while (days <= cantidad) {
      const diaNombre = diasSemana[fechaActual.getDay()];
      //Date.getDay(): domingo = 0 ... sabado = 6
      const horarioActual = disponibilidades[0].horarios!.find(d => d.dia_semana === diaNombre);
      if (horarioActual) {
        // Formatear fecha a ISO (podés cambiarlo según tu necesidad)
        const intervalos = this.generarIntervalos(horarioActual?.horario_inicio!, horarioActual?.horario_fin!, disponibilidad.duracion_turno!);
        fechas.push({ nombre: diaNombre, fecha: fechaActual.toISOString().split('T')[0], horarios: intervalos });
      }
      days += 1;
      console.log("days: ", days + " " + fechaActual.toISOString().split('T')[0]);
      // Pasar al día siguiente
      fechaActual.setDate(fechaActual.getDate() + 1);
    }
    return fechas;
  }


  obtenerFechasDisponibles(dias: string[], cantidad: number = 14) {
    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const fechas: string[] = [];
    const hoy = new Date();
    let days = 1;
    hoy.setDate(hoy.getDate() + 1); // empezar desde mañana
    let fechaActual = new Date(hoy);
    while (days <= cantidad) {
      const diaNombre = diasSemana[fechaActual.getDay()];
      //Date.getDay(): domingo = 0 ... sabado = 6
      if (dias.includes(diaNombre)) {
        // Formatear fecha a ISO (podés cambiarlo según tu necesidad)
        fechas.push(fechaActual.toISOString().split('T')[0]);
      }
      // Pasar al día siguiente
      // console.log("days: ", days + " " + fechaActual.toISOString().split('T')[0]);
      days += 1;
      fechaActual.setDate(fechaActual.getDate() + 1);
    }
    return fechas;
  }

  seleccionarHorario(horario: string) {
    console.log("horario: ", horario);
  }

  extraerDias(disponibilidades: Disponibilidad[]) {
    let dias: string[] = [];
    if (disponibilidades.length > 0) {
      if (disponibilidades[0].horarios !== null) {
        disponibilidades[0].horarios!.forEach(item => {
          dias.push(item.dia_semana!);
        })
      }
    }
    return dias;
  }

  actualizarEspecialista(id_medico: number) {
    this.us.traerEspecialistaId(id_medico).then(({ especialista, error }) => {
      if (error == null) {
        this.especialista = especialista[0];
        console.log("especialista selec: ", this.especialista);
      }
    })
  }

  async traerDisponibilidad(id_especialista: number, especialidad: string) {
    const { data, error } = await this.us.traerDisponibilidad(id_especialista, especialidad);
    if (!error) {
      console.log("Disponibilidad");
      console.log(data);
    }
    const dispoonibilidad: Disponibilidad[] = data!;
    return dispoonibilidad;
  }

  // diasSemana = [
  //   {
  //     nombre: 'Lunes',
  //     fecha: '11/07/2022',
  //     horarios: ['09:00', '09:30', '10:00', '10:30']
  //   },
  //   {
  //     nombre: 'Martes',
  //     fecha: '12/07/2022',
  //     horarios: ['09:00', '09:30', '10:00', '10:30']
  //   },
  //   // ... Miércoles, Jueves, Viernes
  // ];


  seleccionarTurno(dia: string, fecha: string, hora: string) {
    console.log(`Turno seleccionado: ${dia} ${fecha} a las ${hora}`);
    if (this.pacienteActual == null) {
      console.log("Paciente actual no inicializado!");
    } else {
      let nuevoTurno: Turno = {
        id_especialista: this.id_medico, id_paciente: this.pacienteActual.id_paciente!,
        fecha_turno: fecha, horario_turno: hora, especialidad: this.especialidad, estado: EstadoTurno.Pendiente
      };
      nuevoTurno.id_especialista = this.id_medico;

      this.us.cargarTurno(nuevoTurno).then(({ data, error }) => {
        console.log("Error ", error);
        if (error == null) {
          Swal.fire("Exito", "Nuevo turno agendado: " + dia + " " + fecha + " a las " + hora, 'success');
          this.turnosPorEspecialista.push({ fecha_turno: fecha, horario_turno: hora })
        } else {
          Swal.fire("Error", "Su turno no se guardó: ${error}", 'warning');
        }
      });
    }

  }

  generarIntervalos(horaInicio: string, horaFin: string, duracionMinutos: number): string[] {
    const intervalos: string[] = [];

    // Convertir a objetos Date
    const [hInicio, mInicio] = horaInicio.split(':').map(Number);
    const [hFin, mFin] = horaFin.split(':').map(Number);

    const inicio = new Date();
    inicio.setHours(hInicio, mInicio, 0, 0);

    const fin = new Date();
    fin.setHours(hFin, mFin, 0, 0);

    // Iterar y generar los intervalos
    const actual = new Date(inicio);
    while (actual < fin) {
      const hora = actual.toTimeString().slice(0, 5); // "HH:mm"
      intervalos.push(hora);
      actual.setMinutes(actual.getMinutes() + duracionMinutos);
    }

    return intervalos;
  }


  comprobarTurnoTomado(fecha_turno: string, horario_turno: string): Boolean {
    return this.turnosPorEspecialista.some((t) => {
      if (t.fecha_turno == fecha_turno && t.horario_turno == horario_turno
        && t.estado != EstadoTurno.Cancelado && t.estado != EstadoTurno.Rechazado) {
        return true;
      } else {
        return false;
      }
    })
  }

}
