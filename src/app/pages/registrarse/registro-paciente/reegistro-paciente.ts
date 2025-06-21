import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';
import { Perfil } from '../../../enums/enums';
import { Usuario, Paciente } from '../../../interfaces/interfaces';
import { AuthService } from '../../../services/AuthService';
import { UsuarioService } from '../../../services/UsuarioService';
import { CommonModule } from '@angular/common';
import { AuthError } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { Captcha } from '../../captcha/captcha';

@Component({
  selector: 'app-reegistro-paciente',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, Captcha],
  templateUrl: './reegistro-paciente.html',
  styleUrl: './reegistro-paciente.css'
})
export class ReegistroPaciente {
  auth = inject(AuthService);
  us = inject(UsuarioService);
  data: any[] | null = null;
  error = signal<string>("");

  mail: string = "";
  contrasenia: string = "";
  nombre: string = "";
  apellido: string = "";
  edad: number = 0;
  dni: string = "";
  perfil = Perfil.Paciente;
  obra_social: string = "";
  imagen_uno: string = "";
  imagen_dos: string = "";
  especialidad: string = "";
  nuevaEspecialidad: string = "";
  activo: boolean = true;
  hayError: boolean = false;
  mailEjemplo = "ejemplo@gmail.com";
  mensajeErrorEspecialidad = "";
  captchaCompletado: boolean = false;

  opcionSeleccionada: string = "otro";
  otraOpcion: string = '';

  imagenSeleccionada: File | null = null;
  imagenPreview: string | ArrayBuffer | null = null;


  imagenSeleccionadaDos: File | null = null;
  imagenPreviewDos: string | ArrayBuffer | null = null;

  constructor(private router: Router) {

  }

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
    obra_social: new FormControl("---", {
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
    // cuit: new FormControl("20-12345678-4", {
    //   validators: [
    //     Validators.required,
    //     Validators.pattern(/^[\d]{2}-?[\d]{8}-?[\d]{1}$/),
    //   ]
    // }),
    mail: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern(/^[\w-\.]+@([\w-]+\.)+\w{2,4}$/)],
    }),
    contrasenia: new FormControl("123456", {
      validators: [
        Validators.required,
        Validators.pattern(/^\w{6,12}$/)
      ]
    }),
    edad: new FormControl("20", {
      validators: [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.min(18),
        Validators.max(99)
      ]
    }),
    imagenUno: new FormControl(null, {
      validators: [
        Validators.required,
        this.validarImagen
      ]
    }),
    imagenDos: new FormControl(null, {
      validators: [
        Validators.required,
        this.validarImagen
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

  validarImagen(control: AbstractControl, maxSizeMB: number = 2): ValidationErrors | null {
    const file = control.value;
    console.log("control: ", control);
    if (!file) return null; // No hay archivo 

    const extensionesPermitidas = ['jpg', 'jpeg', 'png', 'webp'];
    const extension = file.split('.').pop()?.toLowerCase();

    // Validar tipo
    if (!extension || !extensionesPermitidas.includes(extension)) {
      return { tipoInvalido: true };
    }

    return null; // valido
  }

  revisar() {
    this.formulario?.markAllAsTouched();
    console.log(this.formulario);
  }

  onFileSelected(event: any) {
    console.log("event: ", event)
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;

      // Mostrar previsualización
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onFileSelectedDos(event: any) {
    console.log("event: ", event)
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionadaDos = file;

      // Mostrar previsualización
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreviewDos = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  enviar() {
    if (this.captchaCompletado) {
      if (this.formulario.valid) {
        console.log("Se puede enviar");

        Swal.fire({
          title: "Crear cuenta??",
          showDenyButton: true,
          icon: 'question',
          confirmButtonText: "Crear",
          denyButtonText: `Cancelar`
        }).then((result) => {

          if (result.isConfirmed) {
            this.us.buscarUsuarioMail(this.mail).then((respuesta) => {

              //Verifico que el mail no existe en la tabla usuarios, si es asi creo una nueva cuenta
              if (respuesta.data?.length! == 0) {
                this.us.db.subirFotoPerfil(this.imagenSeleccionada!).then((imagenUno) => {
                  this.us.db.subirFotoPerfil(this.imagenSeleccionadaDos!).then((imagenDos) => {
                    this.registrarse(this.perfil, imagenUno!.linkPublico!.data!.publicUrl || "", imagenDos!.linkPublico!.data!.publicUrl || "");
                  })
                });
              } else {
                Swal.fire("Error", "El mail ya esta siendo usado", 'warning');
              }
            })

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
    } else { //Si el capcha es falso
      Swal.fire("", "Por favor, complete el captcha", "warning");
    }
  }

  async registrarse(perfil: Perfil, linkPublico: string, linkPublicoDos: string) {
    const respuesta = await this.auth.crearCuenta(this.mail, this.contrasenia);
    console.log("registrO::", respuesta);
    if (respuesta.error === null) {

      let nuevoUsuario: Usuario = {
        mail: this.mail.toLowerCase(),
        contrasenia: this.contrasenia,
        nombre: this.nombre,
        apellido: this.apellido,
        edad: this.edad,
        documento: this.dni,
        perfil: perfil,
        imagen_uno: linkPublico,
      };

      await this.us.cargarUsuario(nuevoUsuario).then(({ data, error }) => {
        if (error == null) {
          if (data && data.length > 0) {
            nuevoUsuario.id_usuario = data[0]!.id_usuario;
            console.log("nuevoUsuario :", nuevoUsuario);
            console.log("perfil :", perfil);

            if (perfil === Perfil.Paciente) {
              console.log("paciente...");
              let nuevoPaciente = { ...nuevoUsuario, obra_social: this.obra_social, imagen_dos: linkPublicoDos } as unknown as Paciente;
              this.us.cargarPaciente(nuevoPaciente);
            }
          } else {
            console.log("registro datos vacios");
          };
        }
      });

      this.formulario.reset();
      Swal.fire("Cuenta creada. Por favor, confirme su mail para poder activar su cuenta.", 'success').then((respuesta) => {
        console.log("Respuesta ", respuesta);
        if (respuesta.isConfirmed)
          this.router.navigate(['/login']);
      });
    } else {
      this.hayError = true;
      switch (respuesta.error.status) {
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

  recibirRespuestaCaptcha(respuesta: boolean) {
    if (respuesta) {
      Swal.fire("Ok", "", "success");
    } else {
      Swal.fire("mal", "", "error");
    }
    this.captchaCompletado = respuesta;
  }


}
