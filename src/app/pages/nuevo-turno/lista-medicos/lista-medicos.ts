import { Component, inject, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/UsuarioService';
import { Disponibilidad, Paciente } from '../../../interfaces/interfaces';
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
  medicoElegido: Especialista = {};
  especialidadElegida: string = "";
  listaPacientes: Paciente[] = [];
  verPacientes: boolean = false;

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
    }, 500)

  }

  traerTablas() {
    this.us.traerEspecialistasActivos().then(({ especialistas, error }) => {
      if (error === null) {
        this.especialistas = especialistas!;
        console.log("especialistas ", this.especialistas);
      }
    });

    this.us.traerPacientes().then(({data, error})=>{
      if (error == null){
        this.listaPacientes = data!;
        console.log("this.listaPacientes: ", this.listaPacientes);
      }
    })

  }

  seleccionarMedico(id_medico: number) {
    this.verEspecialidades = true;
    this.medicoElegido = this.especialistas.find(esp => esp.id_especialista == id_medico)!;
    this.especialidadesMedico = this.medicoElegido.especialidades!;
    console.log("especialidades: ", this.especialidadesMedico);

    // this.router.navigate(["especialidad"], {queryParams: {id: id_medico}, relativeTo: this.route});
  }

  seleccionarEspecialidad(especialidad: string) {
    if (this.us.usuarioActual?.perfil == Perfil.Admin) {
      this.verPacientes = true;
      this.especialidadElegida = especialidad;
    } else {
      this.router.navigate(["disponibilidad"], { queryParams: { id: this.medicoElegido.id_especialista, esp: especialidad , paciente: this.us.usuarioActual?.id_usuario}, relativeTo: this.route });
    }
  }

  seleccionarPaciente(paciente: Paciente){
    this.router.navigate(["disponibilidad"], { queryParams: { id: this.medicoElegido.id_especialista, esp: this.especialidadElegida , paciente: paciente.id_usuario}, relativeTo: this.route });
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
