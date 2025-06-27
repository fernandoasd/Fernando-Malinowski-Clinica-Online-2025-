import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthError, User } from '@supabase/supabase-js';
import { UsuarioService } from './UsuarioService';
import { SupabaseService } from './SupabaseService';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  supabaseService = inject(SupabaseService);
  usuarioService = inject(UsuarioService)

  router = inject(Router);
  usuarioActual: User | null = null;
  nombre: string = "";


  constructor() {
    //saber si el usuario esta logueado o no
    this.supabaseService.supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      if (session === null) { //si cierra sesion o no la hay
        this.usuarioActual = null;
        // this.router.navigateByUrl("/login");
      } else { //si inicia sesion
        this.usuarioActual = session.user;
        this.usuarioService.cargarUsuarioMail(this.usuarioActual.email!);
      }
      // this.router.navigateByUrl("/home");
    });
  }

  //crear cuenta
  async crearCuenta(correo: string, contraseña: string) {
    const { data, error } = await this.supabaseService.supabase.auth.signUp({
      email: correo,
      password: contraseña
    });
    console.log("aunth, crear cuenta:", data, "error :", error, "status:  ", error?.status);
    return { data, error };
  }

  //iniciar sesión
  async iniciarSesion(correo: string, contraseña: string) {
    try {
      const { data, error } = await this.supabaseService.supabase.auth.signInWithPassword({
        email: correo,
        password: contraseña
      });
      console.log("aunth, iniciar sesion:", data, error);
      if (error) throw error;
      this.nombre = correo.split('@')[0];;
      this.usuarioService.cargarUsuarioMail(data.user?.email!);
      return { data, error };
    } catch (er: any) {
      let error = "";

      if (er) {
        er = er as AuthError;
        console.log("er?.message ", er?.message);
        switch (er?.message) {
          case "Invalid login credentials":
            error = "Email o contraseña incorrectos";
            break;
          case "Email not confirmed":
            error = "Debés confirmar tu correo antes de iniciar sesión.";
            break;
          case "User not found":
            error = "El usuario no existe";
            break;
          case "Email is not registered":
            error = "El email no está registrado";
            break;
          case "Email is already registered":
            error = "El email ya fue usado";
            break;
          default:
            error = "🔄 Error desconocido. Error Status: " + er?.message;
        }
      }

      Swal.fire("Error", error, 'error');
      return { data: null }
    }
  }

  //cerrar cesión
  async cerrarSesion() {
    const { error } = await this.supabaseService.supabase.auth.signOut()
    console.log("aunth, cerrar sesion:", error);
    this.router.navigate(["home"]);
  }

  async traerUsuarioActual() {
    let mailUsuariOActual = this.usuarioActual?.email;
    return (await this.usuarioService.traerUsuarioMail(mailUsuariOActual!)).data![0];
  }
}
