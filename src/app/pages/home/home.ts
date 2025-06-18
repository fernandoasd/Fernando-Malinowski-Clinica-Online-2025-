import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  constructor(private router: Router){

  }

  alerta(){
     Swal.fire("Cuenta creada. Por favor, confirme su mail para poder activar su cuenta.", 'success').then( (respuesta) => {
            console.log("Respuesta ", respuesta);
            if (respuesta.isConfirmed)
            this.router.navigate(['/login']);
          }) ;
  }
}
