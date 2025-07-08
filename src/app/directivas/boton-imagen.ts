import { Directive, ElementRef, HostListener, Renderer2 } from "@angular/core";

@Directive({
  selector: "[appBotonImagen]"
})
export class BotonImagen {

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, "width", "10rem");
    this.renderer.setStyle(this.el.nativeElement, "height", "10rem");
    this.renderer.setStyle(this.el.nativeElement, "padding", "0");
    this.renderer.setStyle(this.el.nativeElement, "background-position", "center");
    this.renderer.setStyle(this.el.nativeElement, "background-repeat", "no-repeat");
    this.renderer.setStyle(this.el.nativeElement, "background-size", "cover");
    this.renderer.setStyle(this.el.nativeElement, "border", "2px solid black");
    this.renderer.setStyle(this.el.nativeElement, "border-radius", "5px");
    this.renderer.addClass(this.el.nativeElement, "btn");
    this.renderer.addClass(this.el.nativeElement, "border");
    this.renderer.addClass(this.el.nativeElement, "border-dark");
    this.renderer.addClass(this.el.nativeElement, "rounded-4");
  }

  @HostListener("mouseenter")
  onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, "transform", "scale(1.1)");
  }

  @HostListener("mouseleave")
  onMouseLeave() {
    this.renderer.setStyle(this.el.nativeElement, "transform", "scale(1)");
  }
}
