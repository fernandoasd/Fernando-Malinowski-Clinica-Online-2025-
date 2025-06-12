import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UsuarioService } from '../../services/UsuarioSercvice';
import { RouterLink } from '@angular/router';
import { ListaUsuarios } from "./lista-usuarios/lista-usuarios";

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, ListaUsuarios],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios {

}
