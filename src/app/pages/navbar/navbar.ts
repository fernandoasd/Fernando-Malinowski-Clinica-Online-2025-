import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/AuthService';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/UsuarioService';
import { Perfil } from '../../enums/enums';
import { timeInterval } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  auth = inject(AuthService);
  us = inject(UsuarioService);
  perfil = Perfil;

  ngOninit() {
    if (this.us.usuarioActual == null) {
      setInterval(() => {
        console.log("intervalo 1 segundo");
      }, 1000);
    }
  }

  llamar(t: string) {
    console.log(t);
  }

  cerrarSesion() {
    this.auth.cerrarSesion();
  }
}
