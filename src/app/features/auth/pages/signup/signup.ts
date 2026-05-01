import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  sign_inForm: FormGroup;
  showPassword = false;
    constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.sign_inForm = this.fb.group({
   
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.sign_inForm.get(controlName);
    return control?.touched && control?.hasError(errorName) || false;
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordField = document.querySelector('input[formControlName="password"]') as HTMLInputElement;
    if (passwordField) {
      passwordField.type = this.showPassword ? 'text' : 'password';
    }
  }
}
