import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { UsuarioService } from './UsuarioService';
import { SupabaseService } from './SupabaseService';

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
        this.router.navigateByUrl("/login");
      } else { //si inicia sesion
        this.usuarioActual = session.user;
        this.usuarioService.cargarUsuarioMail(this.usuarioActual.email!);
        this.router.navigateByUrl("/home");
      }
    });
  }

  //crear cuenta
  async crearCuenta(correo: string, contraseña: string) {
    try {
      const { data, error } = await this.supabaseService.supabase.auth.signUp({
        email: correo,
        password: contraseña
      });
      console.log("aunth, crear cuenta:", data, "error :", error, "status:  ", error?.status);
      return { data, error };

    } catch (er) {
      return { er };
    }
  }
  
  //iniciar sesión
  async iniciarSesion(correo: string, contraseña: string) {
    const { data, error } = await this.supabaseService.supabase.auth.signInWithPassword({
      email: correo,
      password: contraseña
    });
    this.nombre = correo.split('@')[0];;
    console.log("aunth, iniciar sesion:", data, error);
    this.usuarioService.cargarUsuarioMail(data.user?.email!);
    return { data, error };
  }

  //cerrar cesión
  async cerrarSesion() {
    const { error } = await this.supabaseService.supabase.auth.signOut()
    console.log("aunth, cerrar sesion:", error);
  }

  async traerUsuarioActual() {
    let mailUsuariOActual = this.usuarioActual?.email;
    return (await this.usuarioService.buscarUsuarioMail(mailUsuariOActual!)).data![0];
  }
}
