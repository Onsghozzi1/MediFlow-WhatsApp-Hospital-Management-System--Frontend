import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserServices } from '../../../../core/services/user-services/user-services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup  {
  registerForm: FormGroup;
  profilePic: string | null = null;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserServices,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      password: [''],
      roleTypes:'DOCTOR'
    })
  }
  // Toggle password visibility
  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file: File = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        if (result) {
          const base64 = result.split(',')[1];
          this.profilePic = base64;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  /* ================= SUBMIT ================= */

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormTouched();
      return;
    }

    const payload = this.registerForm.value;

    this.showLoading();

    this.userService.registerUser(payload).subscribe({
      next: (res) => this.handleSuccess(res),
      error: (err) => this.handleError(err)
    });
  }

  /* ================= HELPERS ================= */

  private markFormTouched(): void {
    Object.values(this.registerForm.controls)
      .forEach(control => control.markAsTouched());
  }

  private showLoading(): void {
    Swal.fire({
      title: 'Submitting...',
      text: 'Please wait...',
      icon: 'info',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
  }

  private handleSuccess(res: any): void {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: res?.message || 'Account created successfully 🎉',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      this.registerForm.reset({ roleTypes: 'DOCTOR' });
      this.router.navigate(['/login']);
    });
  }

  private handleError(err: any): void {
    Swal.close();

    const errors: Record<string, string> = err?.error?.data;
    const message = err?.error?.message;

    if (errors && Object.keys(errors).length > 0) {
      this.applyValidationErrors(errors);
      this.showValidationSwal(errors);
      return;
    }

    this.showGeneralError(message);
  }

  private applyValidationErrors(errors: Record<string, string>): void {
    Object.entries(errors).forEach(([field, msg]) => {
      const control = this.registerForm.get(field);
      if (control) {
        control.setErrors({ backend: msg });
      }
    });
  }

  private showValidationSwal(errors: Record<string, string>): void {
    const html = Object.values(errors)
      .map(msg => `• ${msg}`)
      .join('<br>');

    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      html,
      confirmButtonColor: '#ef4444'
    });
  }

  private showGeneralError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message || 'Unexpected error',
      confirmButtonColor: '#ef4444'
    });
  }

  /* ================= FORM HELPERS ================= */

  hasError(controlName: string, errorName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control?.touched && control?.hasError(errorName));
  }
}

