import { Component, inject, signal } from '@angular/core';
import { UsuarioService } from '../../services/UsuarioService';
import { AuthService } from '../../services/AuthService';
import { CommonModule } from '@angular/common';
import { EnlaceRapido } from '../enlace-rapido/enlace-rapido';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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
  error = signal<string>("");
  

  rellenar(array: string[]) {
    this.mail = array[0];
    this.contrasenia = array[1];
  }

  async loguearse() {

    const { data, error } = await this.auth.iniciarSesion(this.mail, this.contrasenia);


    if (error) {
      console.log("login error: ", error);
    }

  }
}
