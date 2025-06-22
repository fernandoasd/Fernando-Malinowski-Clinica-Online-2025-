import { Component, inject, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/UsuarioService';
import { Disponibilidad } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { Especialista } from '../../../interfaces/interfaces';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-crear-turno',
  imports: [CommonModule],
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

  especialistas: Especialista[] = [];

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



  seleccionarMedico(id_medico: number, especialidad: string){
      this.router.navigate(["disponibilidad"], {queryParams: {id: id_medico, esp: especialidad}, relativeTo: this.route});
  }
}
