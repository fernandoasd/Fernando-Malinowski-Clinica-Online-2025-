import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BarController, ChartConfiguration } from 'chart.js';
import jsPDF from 'jspdf';
import { BaseChartDirective } from 'ng2-charts';
import { UsuarioService } from '../../../services/UsuarioService';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { EstadoTurno } from '../../../enums/enums';

@Component({
  selector: 'app-turnos-solicitados-medico',
  imports: [BaseChartDirective, CommonModule, FormsModule],
  templateUrl: './turnos-solicitados-medico.html',
  styleUrl: './turnos-solicitados-medico.css'
})
export class TurnosSolicitadosMedico {
  chartData: ChartConfiguration<'pie'> | null = null;
  us = inject(UsuarioService);
  turnosTotales: any[] = [];
  turnosStats: any = {};
  mostrarInforme: boolean = false;
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor() {

  }

  ngOnInit() {
    this.us.traerTurnos().then(({ data, error }) => {
      if (data) {
        this.turnosTotales = data;
        // this.mostrarGrafico(this.turnosTotales);
        console.log("Turnos ", this.turnosTotales);
      }
    })
  }

  verificarFechas() {
    if (this.startDate && this.endDate) {  // Verificamos que no sean null
      // Aseguramos que startDate y endDate sean objetos Date válidos
      const fechaInicio = this.startDate instanceof Date ? this.startDate : new Date(this.startDate);
      const fechaFin = this.endDate instanceof Date ? this.endDate : new Date(this.endDate);

      fechaInicio.setUTCHours(3);
      fechaFin.setUTCHours(3);

      // Si las fechas son válidas
      if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
        Swal.fire("", "Las fechas de inicio y fin no están definidas correctamente.", 'error');
        return;
      }

      this.mostrarGrafico(this.turnosTotales, fechaInicio, fechaFin);

    } else {
      Swal.fire("", "Las fechas de inicio y fin no están definidas correctamente.", 'error');
    }
  }

  mostrarGrafico(turnos: any[], fechaInicio: Date, fechaFin: Date) {
    console.log("fecha inicio/fin: ", fechaInicio , fechaFin);
      const turnosData: { [key: string]: number } = {};
      const fechaYHora: string = turnos[0].fecha_turno;
      const fecha = new Date(fechaYHora);  // Thu Jul 03 2025 11:41:58 GMT-0300 (hora estándar de Argentina)
      const dateStr = fecha.toLocaleDateString();  // 3/7/2025

      console.log("fechaYHora", fechaYHora);
      console.log("fecha", fecha);
      console.log("fecha str:", dateStr);

      turnos.forEach(turno => {
        const medico = turno.especialistas.nombre + " " + turno.especialistas.apellido;
        let fechaTurno: Date | null = null;

        // Convertir 'fechaSolicitud' a un objeto Date
        console.log('Procesando turno:', turno);

        if (turno.fecha_turno && typeof turno.fecha_turno === 'string') {
          fechaTurno = new Date(turno.fecha_turno); // Convertir la fecha a un objeto Date
          fechaTurno.setUTCHours(3);
          console.log('fechaSolicitud convertida:', fechaTurno);
        } else {
          console.error('Fecha de solicitud inválida:', turno.fecha_turno);
        }

        // Verificación de que 'medico' y 'fechaTurno' no sean null
        if (medico && fechaTurno) {
          console.log('Verificando fechas...');
          console.log('startDate:', fechaInicio);
          console.log('endDate:', fechaFin);

          // Comparar las fechas
          if (fechaTurno >= fechaInicio && fechaTurno <= fechaFin) {
            console.log('Fecha dentro del rango. Médico:', medico);
            if (turnosData[medico]) {
              turnosData[medico]++;
            } else {
              turnosData[medico] = 1;
            }
          } else {
            console.log('Fecha fuera del rango');
          }
        } else {
          console.error('Datos inválidos en turno:', turno);
        }
      });

      // turnos.forEach(turno => {
      //   const especialidad = turno.especialidad;
      //   if (turnosData[especialidad]) {
      //     turnosData[especialidad]++;
      //   } else {
      //     turnosData[especialidad] = 1;
      //   }
      // });

      this.turnosStats = this.calculateEstadisticas(turnosData);
      console.log("this.ingresosStats", this.turnosStats);

      this.chartData = {
        type: 'pie',
        data: {
          labels: Object.keys(turnosData),
          datasets: [{
            label: 'Turnos por medico',
            data: Object.values(turnosData),
            backgroundColor: ['rgba(15, 163, 15, 0.51)', 'rgba(27, 15, 163, 0.51)', 'rgba(163, 57, 15, 0.51)'],
            borderColor: ['rgb(3, 15, 3)'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: {
              text: "Turnos por medico."
            }
          },

        }
      };

      console.log("ingresosData ", turnosData);
  }


  calculateEstadisticas(turnosData: { [key: string]: number }) {
    const sortedTurnos = Object.entries(turnosData).sort((a, b) => b[1] - a[1]);

    const maxTurnos = sortedTurnos[0];
    const minTurnos = sortedTurnos[sortedTurnos.length - 1];

    return {
      maxTurnos,
      minTurnos,
    };
  }

  descargarInformePdf() {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    type RGB = [number, number, number];

    const verde: RGB = [30, 170, 70];
    const negro: RGB = [0, 0, 0];

    // Encabezado
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 30, 'F');
    // doc.setTextColor(...verde);
    // doc.setFontSize(16);
    // doc.text("HISTORIA CLÍNICA", 20, 20);
    doc.addImage("logo.jpg", 'JPG', 160, 5, 40, 20);

    // Título del documento
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...negro);
    doc.setFontSize(20);
    doc.text(`Informe de turnos (SOLICITADOS) por Medico (${this.startDate} al ${this.endDate}):`, 105, 50, { align: "center" });
    // Intentamos capturar el gráfico de Ingresos con un retraso para asegurarnos de que se haya renderizado
    const canvas = document.getElementById('turnosChart') as HTMLCanvasElement;

    if (canvas) {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Añadir el gráfico al PDF sin tapar el banner
      doc.addImage(imgData, 'PNG', 10, 65, imgWidth, imgHeight);

      // Posición de las estadísticas
      const yPosition = 75 + imgHeight + 10;

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('ESTADISTICAS', 20, yPosition);

      doc.setFontSize(15);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);

      const stats = [
        `Medico con más turnos: ${this.turnosStats.maxTurnos[0]} (${this.turnosStats.maxTurnos[1]} turnos)`,
        `Medico con menos turnos: ${this.turnosStats.minTurnos[0]} (${this.turnosStats.minTurnos[1]} turnos)`,
      ];

      stats.forEach((stat, index) => {
        doc.text(stat, 20, yPosition + (index + 1) * 10);
      });

      doc.save('informeTurnosPorMedico.pdf');

    } else {
      console.error('No se encontró el canvas del gráfico de Ingresos');
      doc.save('informeIngresos.pdf');
    }
  }
}


