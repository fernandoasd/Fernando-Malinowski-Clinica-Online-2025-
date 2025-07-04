import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { PalabrasMayusculasPipe } from '../../pipes/letras-mayusculas-pipe';

@Component({
  selector: 'app-titulo',
  imports: [CommonModule, PalabrasMayusculasPipe],
  templateUrl: './titulo.html',
  styleUrl: './titulo.css'
})
export class Titulo {
tituloInput = input<string>();
classInput = input<string>("text-center");
}
