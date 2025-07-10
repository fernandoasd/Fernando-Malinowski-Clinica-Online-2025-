import { Directive, ElementRef, Renderer2, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appDirectivaTitulo]'
})
export class DirectivaTitulo implements OnChanges {

  @Input('appDirectivaTitulo') alignClass: string = 'text-center';

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.addClass(this.el.nativeElement, "bg-dark");
    this.renderer.addClass(this.el.nativeElement, "bg-opacity-50");
    this.renderer.addClass(this.el.nativeElement, "text-light");
    this.renderer.addClass(this.el.nativeElement, "rounded-4");
    this.renderer.addClass(this.el.nativeElement, "p-2");
    this.renderer.addClass(this.el.nativeElement, this.alignClass);
  }

ngOnChanges(changes: SimpleChanges): void {
    if (changes['alignClass']) {
      // Elimina clases previas de alineación
      this.renderer.removeClass(this.el.nativeElement, 'text-start');
      this.renderer.removeClass(this.el.nativeElement, 'text-center');
      this.renderer.removeClass(this.el.nativeElement, 'text-end');

      // Aplica la nueva clase de alineación
      if (this.alignClass) {
        this.renderer.addClass(this.el.nativeElement, this.alignClass);
      }
    }
  }
}