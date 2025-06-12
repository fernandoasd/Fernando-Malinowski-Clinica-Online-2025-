import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListaUsuarios } from '../lista-usuarios/lista-usuarios';

@Component({
  selector: 'app-usuarios-home',
  imports: [CommonModule, ListaUsuarios, RouterLink],
  templateUrl: './usuarios-home.html',
  styleUrl: './usuarios-home.css'
})
export class UsuariosHome {

}
