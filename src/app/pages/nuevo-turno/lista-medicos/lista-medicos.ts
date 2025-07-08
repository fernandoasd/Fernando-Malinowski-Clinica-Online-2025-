import { Component, inject, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/UsuarioService';
import { Disponibilidad, Paciente, Usuario } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { Especialista } from '../../../interfaces/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { Titulo } from '../../../components/titulo/titulo';
import { PalabrasMayusculasPipe } from '../../../pipes/letras-mayusculas-pipe';
import { Perfil } from '../../../enums/enums';
import { BotonImagen } from '../../../directivas/boton-imagen';
import { DirectivaTitulo } from '../../../directivas/directivaTitulo';


@Component({
  selector: 'app-crear-turno',
  imports: [CommonModule, Titulo, PalabrasMayusculasPipe, Titulo, BotonImagen, DirectivaTitulo],
  templateUrl: './lista-medicos.html',
  styleUrl: './lista-medicos.css'
})
export class ListaMedicos implements OnInit {
  us = inject(UsuarioService);

  disponibilidad: Disponibilidad[] = [];
  currentMonth: number;
  currentYear: number;
  currentDay: number;
  daysInMonth: (number | null)[];
  selectedDate: string = '';
  monthNames: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  verEspecialidades: boolean = false;
  especialistas: Especialista[] = [];
  especialidadesMedico: string[] = [];
  listaPacientes: Paciente[] = [];
  pacienteSeleccionado: Paciente = {};
  especialistaElegido: Especialista = {};
  especialidadElegida: string = "";
  verPacientes: boolean = false;
  verEspecialistas: boolean = false;
  verConfirmacion: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.currentDay = today.getDate();
    this.daysInMonth = [];
  }

  ngOnInit() {
    setTimeout(() => {
      this.traerTablas();
    }, 500);
    this.comprobarUsuarioActual();

  }

  traerTablas() {
    this.us.traerEspecialistasActivos().then(({ especialistas, error }) => {
      if (error === null) {
        this.especialistas = especialistas!;
        console.log("especialistas ", this.especialistas);
      }
    });

    this.us.traerPacientes().then(({ data, error }) => {
      if (error == null) {
        this.listaPacientes = data!;
        console.log("this.listaPacientes: ", this.listaPacientes);
      }
    })
  }

  comprobarUsuarioActual() {
    this.verPacientes = false;
    this.verEspecialidades = false;
    this.verEspecialistas = false;
    if (this.us.usuarioActual?.perfil == Perfil.Admin) {
      this.verPacientes = true;
    } else if (this.us.usuarioActual?.perfil == Perfil.Paciente) {
      this.seleccionarUsuario(this.us.usuarioActual!);
    }
  }

  seleccionarUsuario(usuario: Usuario | null) {
    if (usuario) {
      this.pacienteSeleccionado = usuario;
      this.verEspecialistas = true;
      this.verPacientes = false;
    } else {
      this.pacienteSeleccionado = {};
    }
  }

  seleccionarEspecialista(id_medico: number | null) {
    if (id_medico) {
      this.especialistaElegido = this.especialistas.find(esp => esp.id_especialista == id_medico)!;
      this.especialidadesMedico = this.especialistaElegido.especialidades!;
      this.verEspecialistas = false;
      this.verEspecialidades = true;
      this.verConfirmacion = false;

    } else {
      this.especialidadElegida = "";
      this.especialistaElegido = {};
      this.especialidadesMedico = [];
      this.verEspecialistas = true;
      this.verEspecialidades = false;
    }

    console.log("especialidades: ", this.especialidadesMedico);
    // this.router.navigate(["especialidad"], {queryParams: {id: id_medico}, relativeTo: this.route});
  }

  seleccionarEspecialidad(especialidad: string) {
    this.especialidadElegida = especialidad;
    this.verEspecialidades = false;
    this.verConfirmacion = true;
  }

  mostrarDisponibilidad() {
    this.router.navigate(["disponibilidad"], { queryParams: { id: this.especialistaElegido.id_especialista, esp: this.especialidadElegida, paciente: this.pacienteSeleccionado.id_usuario }, relativeTo: this.route });
  }

  selectImagen(esp: string) {
    let retorno = "";
    switch (esp) {
      case "otorrino":
        retorno = "esp/otorrino.jpg";
        break;
      case "traumatologo":
        retorno = "esp/traumat.jpg";
        break;
      case "inmunologo":
        retorno = "esp/inmunologo.jpg";
        break;
      default:
        retorno = "esp.jpg";
        break;
    }
    return retorno;
  }

  // seleccionarMedico(id_medico: number, especialidad: string){
  //     this.router.navigate(["disponibilidad"], {queryParams: {id: id_medico, esp: especialidad}, relativeTo: this.route});
  // }
}
