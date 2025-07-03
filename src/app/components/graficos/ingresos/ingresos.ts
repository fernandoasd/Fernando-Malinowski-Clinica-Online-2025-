import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-ingresos',
  imports: [],
  templateUrl: './ingresos.html',
  styleUrl: './ingresos.css'
})
export class Ingresos {
chartData: ChartConfiguration<'bar' | 'pie'> | null = null;
}
