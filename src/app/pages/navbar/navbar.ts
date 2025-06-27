import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/AuthService';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/UsuarioService';
import { Perfil } from '../../enums/enums';

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

  llamar(t: string) {
    console.log(t);
  }

  cerrarSesion() {
    this.auth.cerrarSesion();
  }
}
