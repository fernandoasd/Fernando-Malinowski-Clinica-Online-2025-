import { Component, output, } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha-2';

@Component({
  selector: 'app-captcha',
  imports: [ReactiveFormsModule, RecaptchaModule, RecaptchaFormsModule],
  templateUrl: './captcha.html',
  styleUrl: './captcha.css'
})
export class Captcha {
  // claveNavegador = "6LeQJWgrAAAAABbGtPkhbjqe98-j1x4xvvSqeTzE";
  // claveSecreta = "6LeQJWgrAAAAANq_weG76PDuvZIPE5yK6uNVBWIG";
  completeCaptchaEvent = output<boolean>();
  captchaValido: boolean = false;


 onCaptchaResolved(captchaResponse: string | null) {
    if (captchaResponse) {
      console.log('Captcha resuelto:', captchaResponse);
      this.captchaValido = true;
      this.completeCaptchaEvent.emit(this.captchaValido);
    } else {
      console.log('Captcha no resuelto o inválido.');
      this.captchaValido = false;
      this.completeCaptchaEvent.emit(this.captchaValido);
    }
  }


}
