import { Component, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { UsuarioService } from '../../../services/UsuarioService';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';

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



}
