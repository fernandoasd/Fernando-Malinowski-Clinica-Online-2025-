import { Directive, ElementRef, inject, OnInit, output, Renderer2, signal, ViewContainerRef } from "@angular/core";
import { UsuarioService } from "../services/UsuarioService";
import Swal from "sweetalert2";

@Directive({
  selector: "[appCaptcha]"
})
export class Captcha implements OnInit {
   img : any;

  constructor(private vcr: ViewContainerRef, private renderer: Renderer2) { 
    this.img = this.renderer.createElement("img");
  }
  srcImagen = signal<string>("imgCaptcha\\captcha.jpg");
  respuesta = "";
  onEnviar = output<boolean>();
  private inputRef!: HTMLInputElement;
  us = inject(UsuarioService);
  captchas: any[] = [];
  

  ngOnInit(): void {
    this.us.traerCaptcha().then(({ data, error }) => {
      console.log("captcha: ", data);
      if (error == null) {
        if (data != null)
          this.captchas = data;
        this.srcImagen.set((this.captchas.length > 0 ? this.captchas[0].imagen : "imgCaptcha\\captcha.jpg"));
        this.renderer.setAttribute(this.img, "src", this.srcImagen());
        this.respuesta = this.captchas.length > 0 ? (this.captchas[0].respuesta).toLowerCase() : "utn2025";
        console.log("this.srcImagen: ", this.srcImagen());
        console.log("this.respuesta: ", this.respuesta);

      }
    })
    
    this.renderer.setStyle(this.img, "width", "400px");
    this.renderer.setStyle(this.img, "display", "block");

    const input = this.renderer.createElement("input");
    this.renderer.setAttribute(input, "type", "text");
    this.renderer.addClass(input, "addClass");
    this.renderer.setAttribute(input, "placeholder", "Escribe el texto");
    this.renderer.setStyle(input, "margin-top", "8px");

    this.inputRef = input as HTMLInputElement;

    const btn = this.renderer.createElement("button");
    this.renderer.addClass(btn, "btn");
    this.renderer.addClass(btn, "btn-lg");
    this.renderer.addClass(btn, "btn-primary");
    this.renderer.addClass(btn, "m-2");
    this.renderer.listen(btn, "click", () => {
      this.comprobarCaptcha();
    });
    this.renderer.setProperty(btn, "textContent", "Enviar");
    // btn.textContent = "Enviar";

    const div = this.renderer.createElement("div");
    this.renderer.addClass(div, "p-1");
    this.renderer.addClass(div, "m-1");
    this.renderer.appendChild(div, this.img);
    this.renderer.appendChild(div, input);
    this.renderer.appendChild(div, btn);

    this.vcr.element.nativeElement.appendChild(div);
  }
  //   this.renderer.listen(boton, "click", () => {
  //   alert("Botón clickeado");
  // });

  comprobarCaptcha() {
    const respuestaUsuario = (this.inputRef.value.trim()).toLowerCase();
    let retorno = false;
    if (respuestaUsuario == this.respuesta) {
      retorno = true;
    }
    if (retorno){
      Swal.fire("Captcha","", "success");
    } else {
      Swal.fire("Captcha","Por favor, volver a intentar Captcha", "warning");
    }
    this.onEnviar.emit(retorno);
  }




}