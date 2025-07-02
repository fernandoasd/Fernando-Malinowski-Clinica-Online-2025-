import { CommonModule } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { UsuarioService } from '../../services/UsuarioService';
import { Usuario } from '../../interfaces/interfaces';


@Component({
  selector: 'app-fab-button',
  imports: [CommonModule],
  templateUrl: './fab-button.html',
  styleUrl: './fab-button.css'
})
export class FabButton {
  us = inject(UsuarioService)
  fabOpen: boolean;
  // especialistas = signal<Especialista[]>([]);
  usuarios = signal<Usuario[]>([]);
  rellenarEvent = output<string[]>();

  constructor(){
    this.fabOpen = false;
  }

  async ngOnInit() {

    this.us.traerUsuarios().then((users) => {
      this.usuarios.set(users);
      console.log("this.usuarios", this.usuarios());
    });

    // this.us.traerEspecialistas().then(({especialistas, error}) => {
    //       if (error ==  null){
    //         this.especialistas.set(especialistas as Especialista[]);
    //       }
    //     });
  }

  toggleFab() {
    this.fabOpen = !this.fabOpen;
    console.log("this.fabOpen: ", this.fabOpen);
  }

  autocompletar(mail: string, contrasenia: string) {
    this.rellenarEvent.emit([mail, contrasenia]);
    this.fabOpen = !this.fabOpen!
  }



}
