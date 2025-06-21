import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { UsuarioService } from '../../services/UsuarioService';
import { Usuario } from '../../interfaces/interfaces';


@Component({
  selector: 'app-enlace-rapido',
  imports: [],
  templateUrl: './enlace-rapido.html',
  styleUrl: './enlace-rapido.css'
})
export class EnlaceRapido {
  @Output() rellenarEvent = new EventEmitter<string[]>();
  db = inject(UsuarioService);
  // autos: Auto[] = [];

  //signal: cuando se actualiza envia una señal al HTML
  usuarios = signal<Usuario[]>([]);
  hayUsuarios: boolean = false;

  ngOnInit() {
    this.db.traerUsuarios().then((usuarios: Usuario[]) => {
      this.usuarios.set(usuarios);
      if (usuarios !== null)
      {
        this.hayUsuarios = true;
      }
      // setTimeout(() => {
      // }, 1000)
    });
  }


  eliminar(id?: number) {
    this.db.eliminarUsuario(id);
    console.log("Eliminar: " + id);
  }

  rellenar(m: string, c: string)
  {
    this.rellenarEvent.emit([m, c]);
  }
}
