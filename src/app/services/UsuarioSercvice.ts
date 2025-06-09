import { inject, Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { SupabaseService } from './SupabaseService';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
db = inject(SupabaseService);

  usuarioActual: any[] = [];
  tablaUsuarios;

  constructor() {
    this.tablaUsuarios = this.db.supabase.from("usuario")
    // console.log(this.db);
  }

  async listar() {
    const { data, error, count, status, statusText } = await this.tablaUsuarios.select("*");
    const usuarios = data as Usuario[]; //de esta forma data va a ser un array de usuarios
    console.log("listar", usuarios, error, count, status, statusText);
    return usuarios;
  }

  async buscarUsuarioContrasenia(mail: string, password: string) {
    const { data, error, count, status, statusText } = await this.tablaUsuarios.select("*").eq("mail", mail).eq("contrasenia", password);
    return data;
  }

  async buscarUsuarioMail(mail: string) {
    return await this.tablaUsuarios.select("*").eq("mail", mail);
  }

  async buscarUsuarioId(id: string) {
    return await this.tablaUsuarios.select("*").eq("id", id);
  }

  async crear(usuario: Usuario) {
    const { data, error, count, status, statusText } = await this.tablaUsuarios.insert(usuario);
    console.log("crear", data, error, count, status, statusText);
  }

  async modificar(usuario: Usuario) {
    // UPDATE ... where id = n
    const { data, error, count, status, statusText } = await this.tablaUsuarios.update(usuario).eq("id", usuario.nombre);
    console.log("modificar", data, error, count, status, statusText);
  }

  async eliminar(id?: number) {
    if (id === undefined) return;
    const { data, error, count, status, statusText } = await this.tablaUsuarios.delete().eq("id", id);
    console.log("eliminar", data, error, count, status, statusText);
  }

  async cargarUsuarioContrasenia(mail: string, password: string) {
    const data = await this.buscarUsuarioContrasenia(mail, password);
    this.usuarioActual = data!;
    console.log(this.usuarioActual);
  }

  async cargarUsuario(mail: string) {
    const {data, error} = await this.buscarUsuarioMail(mail);
    this.usuarioActual = data!;
    console.log(this.usuarioActual);
    return data;
  }
}
