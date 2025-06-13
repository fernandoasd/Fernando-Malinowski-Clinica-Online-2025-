import { Directive, input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[customValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true}]
})
class CustomValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    
    const file = control.value;

    if (!file) return null; // No hay archivo aún

    if (!(file instanceof File)) return { tipoInvalido: true };

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      return { tipoInvalido: true };
    }

    // Validar tamaño
    const maxSizeBytes =  1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { tamanoExcedido: true };
    }

    return null; // válido
    throw new Error('Method not implemented.');
  }
  registerOnValidatorChange?(fn: () => void): void {
    throw new Error('Method not implemented.');
  }
}
