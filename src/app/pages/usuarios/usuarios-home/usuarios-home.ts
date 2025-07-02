import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListaUsuarios } from '../lista-usuarios/lista-usuarios';
import * as XLSX from 'xlsx';
import { UsuarioService } from '../../../services/UsuarioService';
import { Usuario } from '../../../interfaces/interfaces';


@Component({
  selector: 'app-usuarios-home',
  imports: [CommonModule, ListaUsuarios, RouterLink],
  templateUrl: './usuarios-home.html',
  styleUrl: './usuarios-home.css'
})
export class UsuariosHome {
  us = inject(UsuarioService);
  usuarios: Usuario[] = []

  ngOnInit() {
    this.us.traerUsuarios().then((usuarios) => {
      this.usuarios = usuarios;
      console.log("usuarios:", this.usuarios);
    })
  }

  descargarExcel() {
    const usuariosMapeados = this.usuarios.map(usuario => {
      return {
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        perfil: usuario.perfil || '',  
        mail: usuario.mail || '',
        documento: usuario.documento || '',
        edad: usuario.edad || '',
        activo: usuario.activo || '',
      };
    });

    console.log("this.usuarios ", this.usuarios);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(usuariosMapeados, {
      header: ["nombre", "apellido", "perfil", "mail", "documento", "edad", "activo"]
    });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(wb, "usuarios.xlsx");
  }

}
