import { Component, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { UsuarioService } from '../../../services/UsuarioService';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';



@Component({
  selector: 'app-ingresos',
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './ingresos.html',
  styleUrl: './ingresos.css'
})
export class Ingresos {
  chartData: ChartConfiguration<'bar'> | null = null;
  us = inject(UsuarioService);
  ingresosSistema: any[] = [];
  ingresosStats: any = {};

  constructor() {

  }

  ngOnInit() {
    this.us.traerIngresos().then(({ data, error }) => {
      if (data) {
        this.ingresosSistema = data;
        this.procesarIngresos(this.ingresosSistema);
        console.log("ingresos ", this.ingresosSistema);
      }
    })
  }

  // created_at
  //   :
  //   "2025-07-03T14:41:58.399865+00:00"
  // id
  //   :
  //   2
  // id_usuario
  //   :
  //   38
  //   fecha Thu Jul 03 2025 11:41:58 GMT-0300 (hora estándar de Argentina)
  // ingresos.ts:47 fecha str: 3/7/2025
  procesarIngresos(ingresos: any[]) {
    const ingresosData: { [key: string]: number } = {};
    const fechaYHora: string = ingresos[0].created_at;
    const fecha = new Date(fechaYHora);  // Thu Jul 03 2025 11:41:58 GMT-0300 (hora estándar de Argentina)
    const dateStr = fecha.toLocaleDateString();  // 3/7/2025

    console.log("fechaYHora", fechaYHora);
    console.log("fecha", fecha);
    console.log("fecha str:", dateStr);

    ingresos.forEach(log => {
      const fechaYHora: string = log.created_at;
      const fecha = new Date(fechaYHora); // Thu Jul 03 2025 11:41:58 GMT-0300 (hora estándar de Argentina)
      const dateStr = fecha.toLocaleDateString();  // 3/7/2025

      if (ingresosData[dateStr]) {
        ingresosData[dateStr]++;
      } else {
        ingresosData[dateStr] = 1;
      }
    });

    this.ingresosStats = this.calculateIngresosStats(ingresosData);
    console.log("this.ingresosStats", this.ingresosStats);

    this.chartData = {
      type: 'bar',
      data: {
        labels: Object.keys(ingresosData),
        datasets: [{
          data: Object.values(ingresosData),
          label: 'Ingresos por Día',
          backgroundColor: 'rgba(15, 163, 15, 0.51)',
          borderColor: 'rgb(3, 15, 3)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            text: "Ingresos por día."
          }
        }
      }
    };

    console.log("ingresosData ", ingresosData);
  }


  calculateIngresosStats(ingresosData: { [key: string]: number }) {
    const sortedIngresos = Object.entries(ingresosData).sort((a, b) => b[1] - a[1]);

    const maxIngresosUser = sortedIngresos[0];
    const minIngresosUser = sortedIngresos[sortedIngresos.length - 1];

    // Suponiendo que los ingresos están por día, calculamos también los días con más/menos ingresos
    const sortedIngresosByDay = Object.entries(ingresosData).sort((a, b) => b[1] - a[1]);

    const maxIngresosDay = sortedIngresosByDay[0];
    const minIngresosDay = sortedIngresosByDay[sortedIngresosByDay.length - 1];

    return {
      maxIngresosUser,
      minIngresosUser,
      maxIngresosDay,
      minIngresosDay,
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
    doc.text("Informe de Ingresos.", 105, 50, { align: "center" });
    // Intentamos capturar el gráfico de Ingresos con un retraso para asegurarnos de que se haya renderizado
    const canvas = document.getElementById('ingresosChart') as HTMLCanvasElement;

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
        `Máximo de ingresos por día: ${this.ingresosStats.maxIngresosDay[0]} (${this.ingresosStats.maxIngresosDay[1]} ingresos)`,
        `Mínimo de ingresos por día: ${this.ingresosStats.minIngresosDay[0]} (${this.ingresosStats.minIngresosDay[1]} ingresos)`,
      ];

      stats.forEach((stat, index) => {
        doc.text(stat, 20, yPosition + (index + 1) * 10);
      });

      doc.save('informeIngresos.pdf');

    } else {
      console.error('No se encontró el canvas del gráfico de Ingresos');
      doc.save('informeIngresos.pdf');
    }
  }
}
