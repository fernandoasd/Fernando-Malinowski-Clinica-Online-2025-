import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  from(arg0: string) {
    throw new Error('Method not implemented.');
  }
  supabase: SupabaseClient<any, "public", any>;

  bucketPerfil = "imagen-perfil";
  mbMax = 2;
  tamañoMaximoFoto = this.mbMax * 1024 * 1024;

  constructor() {
    this.supabase = createClient(
      "https://tyuiwfpujqzeaxbhaprw.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dWl3ZnB1anF6ZWF4YmhhcHJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MjQxNjgsImV4cCI6MjA2NTAwMDE2OH0.FkFNqhsuxFLKPy5bBCc6TnJhTql70jqShIIA1MRWr1Q"
    );
  }

  async crearBucket() {
    const { data, error } = await this.supabase.storage.createBucket(this.bucketPerfil, {
      public: true,
      fileSizeLimit: "5MB",
      allowedMimeTypes: ["image/jpg", "image/png", "image/gif"]
    });
    console.log(data, error);
    return { data, error };
  }

  async subirFotoPerfil(archivo: File) {
    if (!archivo || archivo.size > this.tamañoMaximoFoto) {
      alert(`El archivo es muy grande. Máximo ${this.mbMax} MB. existe?  ${archivo == null} name ${archivo!.name} size ${archivo!.size} `);

      return
    } else {
      const nombreArchivo = `${Date.now()}_${archivo.name}`;
      const { data, error, linkPublico } = await this.supabase.storage.from(this.bucketPerfil).upload(nombreArchivo, archivo).
        then(({ data, error }) => {
          console.log("path: ", data!.path);
          let linkPublico;
          linkPublico = this.supabase
            .storage
            .from('imagen-perfil')
            .getPublicUrl(data!.path); // ruta = nombreArchivo
          return { data, error, linkPublico }
        });
      console.log(data, error, linkPublico);
      return {data, error, linkPublico};
    }
  }

  descargarImagen() {

  }
}
