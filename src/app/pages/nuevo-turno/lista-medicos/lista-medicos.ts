import { Component, inject, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/UsuarioService';
import { Disponibilidad } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { Especialista } from '../../../interfaces/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { Titulo } from '../../../components/titulo/titulo';
import { PalabrasMayusculasPipe } from '../../../pipes/letras-mayusculas-pipe';


@Component({
  selector: 'app-crear-turno',
  imports: [CommonModule, Titulo, PalabrasMayusculasPipe, Titulo],
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
    this.us.traerEspecialistasCompleto().then(({ especialistas, error }) => {
      if (error === null) {
        this.especialistas = especialistas!;
        console.log("especialistas ", this.especialistas);
      }
    })
  }

  seleccionarMedico(id_medico: number){
    this.verEspecialidades = true;
    this.medicoElegido = this.especialistas.find(esp => esp.id_especialista == id_medico)!;
    this.especialidadesMedico = this.medicoElegido.especialidades!;
    console.log("especialidades: ", this.especialidadesMedico);

      // this.router.navigate(["especialidad"], {queryParams: {id: id_medico}, relativeTo: this.route});
  }

    seleccionarEspecialidad(especialidad: string){
      this.router.navigate(["disponibilidad"], {queryParams: {id: this.medicoElegido.id_especialista, esp: especialidad}, relativeTo: this.route});
  }

  // seleccionarMedico(id_medico: number, especialidad: string){
  //     this.router.navigate(["disponibilidad"], {queryParams: {id: id_medico, esp: especialidad}, relativeTo: this.route});
  // }
}
