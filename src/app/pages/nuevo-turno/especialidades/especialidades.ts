import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Especialista } from '../../../interfaces/interfaces';
import { UsuarioService } from '../../../services/UsuarioService';

@Component({
  selector: 'app-especialidades',
  imports: [],
  templateUrl: './especialidades.html',
  styleUrl: './especialidades.css'
})
export class Especialidades {
  id_medico = -1;
  especialidad = "";
  especialista: Especialista = {}
  us = inject(UsuarioService);
  especialidades: string[] = [];

    constructor(private route: ActivatedRoute) {
    console.log("route: ", this.route),
      this.route.queryParams.subscribe(params => {
        // this.especialista = this.us.tr
        console.log("params: ", params);
        this.id_medico = params["id"];
        this.especialidad = params["esp"]
        this.actualizarEspecialista(this.id_medico);
      })
  }

    actualizarEspecialista(id_medico: number) {
    this.us.traerEspecialistaId(id_medico).then(({ especialista, error }) => {
      if (error == null) {
        this.especialista = especialista[0];
        console.log("especialista selec: ", this.especialista);
      }
    })
  }

}
