import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UsuarioService } from '../../../services/UsuarioService';
import { Usuario } from '../../../interfaces/interfaces';


@Component({
  selector: 'app-lista-usuarios',
  imports: [CommonModule],
  templateUrl: './lista-usuarios.html',
  styleUrl: './lista-usuarios.css'
})
export class ListaUsuarios {
 us = inject(UsuarioService);

  listaUsuarios: Usuario[] = [];

  ngOnInit() {
    this.inicio();

  }

  cambiarActivo(id_usuario: number, activo: boolean){
    this.us.deshabilitarUsuario(id_usuario, activo).then(({data , error}) =>{
      this.inicio();
    });
  }

  async inicio() {
  this.listaUsuarios = await this.us.traerUsuarios();
  console.log("Usuarios: ", this.listaUsuarios);
  }
}
