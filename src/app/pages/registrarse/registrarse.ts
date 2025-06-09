import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/AuthService';
import { UsuarioService } from '../../services/UsuarioSercvice';
import Swal from 'sweetalert2';
import { Usuario } from '../../models/usuario';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-registrarse',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './registrarse.html',
  styleUrl: './registrarse.css',
})
export class Registrarse {
  auth = inject(AuthService);
  tablaUsuario = inject(UsuarioService);
  data: any[] | null = null;
  error = signal<string>("");

  mail: string = "";
  contrasenia: string = "";
  nombre: string = "";
  apellido: string = "";
  edad: number = 0;
  dni: string = "";
  perfil: string = "";
  obraSocial: string = "";
  urlImageUno: string = "";
  urlImageDos: string = "";
  especialidad: string = "";
  nuevaEspecialidad: string = "";
  especialidades: any[] = [];
  activo: boolean = true;
  hayError: boolean = false;
  mailEjemplo = "ejemplo@gmail.com";

  opcionSeleccionada: string = "otro";
  otraOpcion: string = '';


  formulario = new FormGroup({
    nombre: new FormControl("---", {
      validators: [
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.required],
    }),
    apellido: new FormControl("---", {
      validators: [
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.required],
    }),
    obraSocial: new FormControl("---", {
      validators: [
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.required],
    }),
    dni: new FormControl("38000000", {
      validators: [
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.required],
    }),
    cuit: new FormControl("20-12345678-4", {
      validators: [
        Validators.required,
        Validators.pattern(/^[\d]{2}-?[\d]{8}-?[\d]{1}$/),
      ]

    }),
    mail: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern(/^[\w-\.]+@([\w-]+\.)+\w{2,4}$/)],
    }),
    contrasenia: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern(/^\w{6,12}$/)
      ]
    }),
    perfil: new FormControl("", {
      validators: [
        Validators.required,
        Validators.minLength(3),
      ]
    }),
    especialidad: new FormControl("---", {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]
    }),
    nuevaEspecialidad: new FormControl("---", {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]
    }),
    edad: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.min(18),
        Validators.max(99)
      ]
    })
  })

  ngOninit() {
    // this.formulario.valueChanges.subscribe((value) => {
    //   console.log(value);
    // }) 
    this.formulario.statusChanges.subscribe((value) => {
      console.log(value);
      console.log(this.formulario);
    })
  }

  revisar() {
    this.formulario?.markAllAsTouched();
    console.log(this.formulario);
  }

  enviar() {
    console.log(this.formulario);
    if (this.formulario.valid) {
      console.log("Se puede enviar");

      Swal.fire({
        title: "Crear cuenta??",
        showDenyButton: true,
        icon: 'question',
        confirmButtonText: "Crear",
        denyButtonText: `Salir`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.registrarse();
        }
      });

    } else {
      this.formulario?.markAllAsTouched();
      console.log("No se puede enviar");
      Swal.fire({
        icon: 'warning',
        title: "Error",
        text: "compruebe los campos requeridos",
        draggable: true
      });
    }
  }

  async registrarse() {
    const respuesta = await this.auth.crearCuenta(this.mail, this.contrasenia);
    if (respuesta.error === null) {
      this.tablaUsuario.crear(new Usuario(this.mail.toLowerCase(), this.contrasenia,
        this.nombre, this.apellido, this.edad, this.dni, this.obraSocial, this.perfil, this.especialidad,
        this.urlImageUno, this.urlImageDos, this.activo));

      Swal.fire("Cuenta creada, bienvenido " + this.nombre, "", 'success');
    } else {

      // this.error.set(respuesta.error);
      this.hayError = true;
      switch (respuesta.error?.status) {
        case 400:
          this.error.set("Se requiere una contraseña válida.");
          break;
        case 401:
          this.error.set("Solicitud inválida");
          break;
        case 403:
          this.error.set("Prohibido: No tenés permiso");
          break;
        case 422:
          this.error.set("El usuario ya existe");
          break;
        default:
          this.error.set("🔄 Error desconocido. Error Status: " + respuesta.error?.status);
      }

      Swal.fire("Error", this.error(), 'error');

    }
  }
}
