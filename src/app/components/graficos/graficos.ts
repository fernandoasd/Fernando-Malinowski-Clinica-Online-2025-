import { Component } from '@angular/core';
import { Titulo } from '../titulo/titulo';
import { NgSwitch } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-graficos',
  imports: [Titulo, RouterOutlet, RouterLink],
  templateUrl: './graficos.html',
  styleUrl: './graficos.css'
})
export class Graficos {
  grafico: boolean = false;

  mostrarGrafico(numero: number){
    switch(numero){
      case 0:
    }
  }


}
