import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { LetrasMayusculasPipe } from '../../pipes/letras-mayusculas-pipe';

@Component({
  selector: 'app-titulo',
  imports: [CommonModule, LetrasMayusculasPipe],
  templateUrl: './titulo.html',
  styleUrl: './titulo.css'
})
export class Titulo {
tituloInput = input<string>();
classInput = input<string>("text-center");
}
