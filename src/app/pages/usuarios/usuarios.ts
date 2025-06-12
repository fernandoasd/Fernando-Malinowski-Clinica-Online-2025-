import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';

import {RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios {

}
