import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { UsuarioService } from '../../services/UsuarioSercvice';
import { Usuario } from '../../interfaces/interfaces';


@Component({
  selector: 'app-enlace-rapido',
  imports: [],
  templateUrl: './enlace-rapido.html',
  styleUrl: './enlace-rapido.css'
})
export class EnlaceRapido {
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

  @Output() rellenarEvent = new EventEmitter<string[]>();

  eliminar(id?: number) {
    this.db.eliminar(id);
    console.log("Eliminar: " + id);
  }

  rellenar(m: string, c: string)
  {
    this.rellenarEvent.emit([m, c]);
  }
}
