import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-titulo',
  imports: [CommonModule],
  templateUrl: './titulo.html',
  styleUrl: './titulo.css'
})
export class Titulo {
tituloInput = input<string>();
classInput = input<string>("text-center");
}
