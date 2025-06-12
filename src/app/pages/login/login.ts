import { Component, inject } from '@angular/core';
import { UsuarioService } from '../../services/UsuarioSercvice';
import { AuthService } from '../../services/AuthService';
import { CommonModule } from '@angular/common';
import { EnlaceRapido } from '../enlace-rapido/enlace-rapido';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, EnlaceRapido],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  auth = inject(AuthService);
  usuario = inject(UsuarioService);
  mail: string = "";
  contrasenia: string = "";

  rellenar(array: string[]) {
    this.mail = array[0];
    this.contrasenia = array[1];
  }

  loguearse() {
    this.auth.iniciarSesion(this.mail, this.contrasenia);
  }
}
