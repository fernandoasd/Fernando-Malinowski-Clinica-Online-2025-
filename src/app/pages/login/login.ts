import { Component, inject, signal } from '@angular/core';
import { UsuarioService } from '../../services/UsuarioService';
import { AuthService } from '../../services/AuthService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Perfil } from '../../enums/enums';
import { FabButton } from '../../components/fab-button/fab-button';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../interfaces/interfaces';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, FabButton, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  auth = inject(AuthService);
  usuario = inject(UsuarioService);
  mail: string = "";
  contrasenia: string = "";
  error = signal<string>("");


  constructor(private router: Router) {

  }

  rellenar(array: string[]) {
    this.mail = array[0];
    this.contrasenia = array[1];
  }

  async loguearse() {
    let retorno = await this.usuario.traerUsuarioMail(this.mail);
    console.log("usuario: ", retorno);
    if (retorno.error == null && retorno.data.length > 0) {
      const usuarioEntrante = retorno.data[0] as Usuario;
      if (usuarioEntrante.perfil == Perfil.Especialista) {
        if (usuarioEntrante.activo) {
          const { data, error } = await this.auth.iniciarSesion(this.mail, this.contrasenia);
          if (data) {
            this.router.navigate(["home"]);
          }
        } else {
          Swal.fire("Ingreso no autorizado", "Usuario no autorizado por Admin", "warning");
        }
      } else {
        const { data, error } = await this.auth.iniciarSesion(this.mail, this.contrasenia);
        if (data) {
          this.router.navigate(["home"]);
        }
      }
    }


  }
}
