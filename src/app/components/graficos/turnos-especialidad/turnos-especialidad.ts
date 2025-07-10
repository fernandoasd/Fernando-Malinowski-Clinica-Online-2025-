import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import jsPDF from 'jspdf';
import { BaseChartDirective } from 'ng2-charts';
import { UsuarioService } from '../../../services/UsuarioService';

@Component({
  selector: 'app-turnos-especialidad',
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './turnos-especialidad.html',
  styleUrl: './turnos-especialidad.css'
})
export class TurnosEspecialidad {
  chartData: ChartConfiguration<'pie'> | null = null;
  us = inject(UsuarioService);
  turnosTotales: any[] = [];
  turnosStats: any = {};

  constructor() {

  }

  ngOnInit() {
    this.us.traerTurnos().then(({ data, error }) => {
      if (data) {
        this.turnosTotales = data;
        this.procesarTurnos(this.turnosTotales);
        console.log("Turnos ", this.turnosTotales);
      }
    })
  }

  procesarTurnos(turnos: any[]) {
    const turnosData: { [key: string]: number } = {};
    const fechaYHora: string = turnos[0].created_at;
    const fecha = new Date(fechaYHora);  // Thu Jul 03 2025 11:41:58 GMT-0300 (hora estándar de Argentina)
    const dateStr = fecha.toLocaleDateString();  // 3/7/2025

    console.log("fechaYHora", fechaYHora);
    console.log("fecha", fecha);
    console.log("fecha str:", dateStr);

    turnos.forEach(turno => {
      const especialidad = turno.especialidad;
      if (turnosData[especialidad]) {
        turnosData[especialidad]++;
      } else {
        turnosData[especialidad] = 1;
      }
    });

    this.turnosStats = this.calculateEstadisticas(turnosData);
    console.log("this.ingresosStats", this.turnosStats);

    this.chartData = {
      type: 'pie',
      data: {
        labels: Object.keys(turnosData),
        datasets: [{
          label: 'Turnos por Especialidad',
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
          text: "Turnos por especialidad."
        }
        },
        
      }
    };

    console.log("ingresosData ", turnosData);
  }


  calculateEstadisticas(turnosData: { [key: string]: number }) {
    const sortedTurnos = Object.entries(turnosData).sort((a, b) => b[1] - a[1]);

    const maxTurnosDia = sortedTurnos[0];
    const minTurnosDia = sortedTurnos[sortedTurnos.length - 1];

    // Promedio de turnos por día
    const totalTurnos = Object.values(turnosData).reduce((sum, value) => sum + value, 0);
    const avgTurnosDia = parseFloat((totalTurnos / Object.keys(turnosData).length).toFixed(2));

    return {
      maxTurnosDia,
      minTurnosDia,
      avgTurnosDia,
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
    doc.text("Informe de turnos por especialidad.", 105, 50, { align: "center" });
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
        `Especialidad con más turnos: ${this.turnosStats.maxTurnosDia[0]} (${this.turnosStats.maxTurnosDia[1]} turnos)`,
        `Especialidad con menos turnos: ${this.turnosStats.minTurnosDia[0]} (${this.turnosStats.minTurnosDia[1]} turnos)`,
        `Promedio de turnos por especialidad: ${this.turnosStats.avgTurnosDia} (turnos)`
      ];

      stats.forEach((stat, index) => {
        doc.text(stat, 20, yPosition + (index + 1) * 10);
      });

      doc.save('informeTurnosEspecialidad.pdf');

    } else {
      console.error('No se encontró el canvas del gráfico de Ingresos');
      doc.save('informeIngresos.pdf');
    }
  }
}

