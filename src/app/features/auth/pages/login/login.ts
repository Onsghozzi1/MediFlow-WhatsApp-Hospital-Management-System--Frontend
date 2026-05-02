import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserServices } from '../../../../core/services/user-services/user-services';
import { AuthService } from '../../../../core/services/auth/auth-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  showPassword = false;
  errorMessage: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authservice: AuthService,

  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.loginForm.get(controlName);
    return control?.touched && control?.hasError(errorName) || false;
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordField = document.querySelector('input[formControlName="password"]') as HTMLInputElement;
    if (passwordField) {
      passwordField.type = this.showPassword ? 'text' : 'password';
    }
  }

  onSubmit(): void {
    // Check if form is invalid before submitting
    if (!this.loginForm.valid) {
      this.errorMessage = 'يرجى إدخال جميع البيانات المطلوبة';
      return;
    }

    // Destructure values from the form
    const { email, password } = this.loginForm.value;

    // Call login method from AuthService
    this.authservice.login(email, password).subscribe({
      next: (response) => {
        // Clear the form after successful login
        this.loginForm.reset();

        // Extract user info from response
        const { user } = response;
        //  if(!user.firstTimeLogin){
        this.router.navigate(['/dashboard']);

        //     }else {
        //     this.router.navigate(['/list-project']);

        //  }
        console.log("Logged user:", user);

        // Redirect based on whether it is their first login

      },
      error: (err) => {
        // Display user-friendly error or fallback message
        this.errorMessage = err?.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  }
}
