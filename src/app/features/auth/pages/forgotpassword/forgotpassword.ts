import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth/auth-service';

@Component({
  selector: 'app-forgotpassword',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './forgotpassword.html',
  styleUrl: './forgotpassword.css',
})
export class Forgotpassword {
  forgotPasswordForm!: FormGroup;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {

    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched(); // ✅ show errors

      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please enter a valid email address'
      });
      return;
    }

    this.isLoading = true;

    const email = this.forgotPasswordForm.value.email;

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.isLoading = false;

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'A password reset link has been sent to your email'
        });

        this.forgotPasswordForm.reset();
      },
      error: (err) => {
        this.isLoading = false;

        let message = err.error?.message;

        if (message === 'Account not found') {
          message = 'Account not found';
        } else if (message === 'Account is not validated') {
          message = 'Account is not validated';
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message || 'Something went wrong'
        });
      }
    });
  }}