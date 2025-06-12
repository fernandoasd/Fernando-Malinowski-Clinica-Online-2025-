import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UsuarioService } from '../../../services/UsuarioSercvice';
import { Usuario } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-lista-usuarios',
  imports: [CommonModule],
  templateUrl: './lista-usuarios.html',
  styleUrl: './lista-usuarios.css'
})
export class ListaUsuarios {
 db = inject(UsuarioService);

  listaUsuarios: Usuario[] = [];

  ngOnInit() {
    console.log("Usuarios");
    
    this.inicio();
  }

  inicio() {
    this.db.traerUsuarios().then((u: Usuario[]) => {
      this.listaUsuarios = u;
      console.log("Usuarios: ", this.listaUsuarios);
    });

  }
}
