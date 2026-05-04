import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Route, Router, RouterLink } from '@angular/router';
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
    private fb: FormBuilder,
    private router:Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
 onSubmit(): void {

  if (this.forgotPasswordForm.invalid) {
    this.forgotPasswordForm.markAllAsTouched();

    Swal.fire({
      title: "MediFlow Clinics",
      icon: "warning",
      text: "Please enter a valid email address",
      confirmButtonColor: "#2a7fba"
    });

    return;
  }

  const email = this.forgotPasswordForm.value.email;

  // 💉 SHOW ECG LOADING
  Swal.fire({
    title: "MediFlow Clinics",
    html: `
      <div class="ecg-wrapper">
        <svg viewBox="0 0 300 80" class="ecg-line">
          <polyline
            points="0,40 20,40 30,40 40,10 50,70 60,40 80,40 100,40 110,40 120,20 130,60 140,40 160,40 180,40 200,40 210,30 220,50 230,40 250,40 270,40 300,40"
          />
        </svg>
      </div>
      <p style="margin-top:10px;">Processing request...</p>
    `,
    showConfirmButton: false,
    allowOutsideClick: false,
    background: "#ffffff",
    color: "#1e5f91"
  });

  // 🌐 API CALL
  this.authService.forgotPassword(email).subscribe({

    next: () => {

      Swal.fire({
        title: "Success",
        icon: "success",
        text: "Reset link sent successfully",
        confirmButtonColor: "#2a7fba"
      }).then(() => {
        this.router.navigate(['/login']);
      });

      this.forgotPasswordForm.reset();
    },

    error: (err) => {

      let message = err.error?.message;

      if (message === 'Account not found') {
        message = 'Account not found';
      } else if (message === 'Account is not validated') {
        message = 'Account is not validated';
      }

      Swal.fire({
        title: "Error",
        icon: "error",
        text: message || "Something went wrong",
        confirmButtonColor: "#2a7fba"
      });
    }
  });
}}