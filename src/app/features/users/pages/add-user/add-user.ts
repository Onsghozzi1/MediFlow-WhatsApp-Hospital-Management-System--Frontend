import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserServices } from '../../../../core/services/user-services/user-services';
import { ActivatedRoute, Router } from '@angular/router';
import { UserManagement } from '../../services/user-management';
import { AuthService } from '../../../../core/services/auth/auth-service';
import { filter, map, switchMap, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User_filter } from '../../../../core/models/user.model';

@Component({
  selector: 'app-add-user',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
})
export class AddUser implements OnInit {
  private destroyRef = inject(DestroyRef);

  registerForm!: FormGroup;
  profilePic: string | null = null;

  showPassword = false;
  userId: number | null = null;

  filter: User_filter = {
    idUser: 0,
  
  };

  constructor(
    private fb: FormBuilder,
    private userService: UserServices,
    private router: Router,
    private route: ActivatedRoute,
    private userPanelManagementService: UserManagement,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadUserIfEdit();
  }

  // =========================
  // INIT FORM
  // =========================
  private initForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      password: [''],
      role: ['', Validators.required],
    });
  }

  // =========================
  // LOAD USER (EDIT MODE)
  // =========================
  private loadUserIfEdit(): void {
    this.route.params.pipe(

      map(params => Number(params['id'])),

      tap(id => {
        this.userId = (!id || isNaN(id)) ? null : id;
      }),

      filter(id => !!id && !isNaN(id)),

      switchMap(id => {
        const filter: User_filter = {
          ...this.filter,
          idUser: id
        };

        return this.userPanelManagementService.GetUserList(0, 1, filter);
      }),

      takeUntilDestroyed(this.destroyRef)

    ).subscribe({
      next: (data: any) => {
        const user = data?.content?.[0];
        if (!user) return;

        this.profilePic = user.profilePicture;

        this.registerForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phone,
          role: user.roleTypes,
        });
      },
      error: err => console.error('Load user error:', err)
    });
  }

  // =========================
  // VALIDATION HELPERS
  // =========================
  hasError(control: string, error: string): boolean {
    const c = this.registerForm.get(control);
    return !!(c && c.touched && c.hasError(error));
  }

  // =========================
  // SUBMIT
  // =========================

onSubmit(): void {

  const formData = {
    ...this.registerForm.value,
    phone: this.registerForm.value.phoneNumber,
    profilePicture: this.profilePic,
    roleTypes: this.registerForm.value.role
  };

  const role = this.registerForm.get('role')?.value;

  // =========================
  // UPDATE MODE
  // =========================
  if (this.userId && this.userId > 0) {
    this.updateUser(formData);
    return;
  }

  // =========================
  // LOADING
  // =========================
  Swal.fire({
    title: 'Creating...',
    text: 'Please wait while creating user',
    icon: 'info',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  // =========================
  // SUCCESS HANDLER
  // =========================
  const handleSuccess = (message: string) => {

    Swal.close();

    Swal.fire({
      icon: 'success',
      title: message,
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      this.router.navigate(['users/users_list']);
    });
  };

  // =========================
  // ERROR HANDLER
  // =========================
  const handleError = (err: any) => {

    Swal.close();

    const response = err?.error;

    console.log('ERROR RESPONSE:', response);

    // Validation errors
    if (response?.data && typeof response.data === 'object') {

      Swal.fire({
        icon: 'warning',
        title: response?.message || 'Validation failed',
        confirmButtonText: 'OK'
      });

      Object.entries(response.data).forEach(([field, value]: any) => {

        const control = this.registerForm.get(field);

        if (control) {
          control.setErrors({
            backend: value?.message || 'Invalid value'
          });

          control.markAsTouched();
        }
      });

      return;
    }

    // Email exists
    if (err.status === 409) {

      Swal.fire({
        icon: 'warning',
        title: 'Email already exists',
        text: 'Please use another email'
      });

      return;
    }

    // Generic error
    Swal.fire({
      icon: 'error',
      title: response?.message || 'Something went wrong'
    });
  };

  // =========================
  // CALL API BASED ON ROLE
  // =========================
  const request$ =
    role === 'ADMIN'
      ? this.userService.registerAdmin(formData)
      : this.userService.registerUser(formData);

  request$.subscribe({
    next: () =>
      handleSuccess(
        role === 'ADMIN'
          ? 'Admin created successfully'
          : 'User created successfully'
      ),

    error: handleError
  });
}

  // =========================
  // UPDATE USER
  // =========================
 private updateUser(data: any): void {

  Swal.fire({
    title: 'Confirm update',
    text: 'Do you want to save changes?',
    icon: 'question',

    showCancelButton: true,
    confirmButtonText: 'Yes, update',
    cancelButtonText: 'Cancel',
  customClass: {
    popup: 'swal-popup',
    confirmButton: 'swal-confirm',
    cancelButton: 'swal-cancel'
  }
 
  }).then(result => {

    if (!result.isConfirmed) return;

    this.authService.updateUser(data).subscribe({
      next: () => {

        this.userPanelManagementService.updatPhoto(data.profilePicture);

        Swal.fire('Updated!', 'User updated successfully', 'success');

        this.router.navigate(['/users/users_list']); // 👈 fix bug هنا
      },
      error: () => {
        Swal.fire('Error', 'Update failed', 'error');
      }
    });

  });
}

  // =========================
  // CREATE USER
  // =========================
  private createUser(data: any): void {

    Swal.fire({
      title: 'Creating...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.userService.registerUser(data).subscribe({

      next: () => {

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User created successfully',
          timer: 1500,
          showConfirmButton: true
        }).then(() => {
          this.router.navigate(['users/users_list']);
        });

      },
      error: (err) => {

        Swal.close();

        const response = err?.error;

        console.log("ERROR RESPONSE:", response);

        // =========================
        // CASE 1: Validation errors
        // =========================
        if (response?.data && typeof response.data === 'object') {

          // Convert validation object → HTML list
          const errorList = Object.entries(response.data)
            .map(([field, value]: any) => {
              return `<li><b>${field}</b>: ${value?.message}</li>`;
            })
            .join('');

          Swal.fire({
            icon: 'warning',
            title: response?.message || 'Validation failed',

            confirmButtonText: 'OK',

            buttonsStyling: false, // 👈 مهم جدًا

            customClass: {
              confirmButton: 'swal-btn-ok'
            },
            html: `
<div style="
  text-align:left;
  font-family: Inter, system-ui, sans-serif;
">



  <!-- Error Cards -->
  <div style="display:flex; flex-direction:column; gap:10px;">

    ${Object.entries(response.data)
                .map(([field, value]: any) => `
        <div style="
          background: #fff;
          border: 1px solid #f1f1f1;
          border-left: 4px solid #ff4d4d;
          border-radius: 10px;
          padding: 10px 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        ">
    

          <div style="
            font-size:13px;
            font-weight:500;
            color:#222;
          ">
            ${value.message}
          </div>
        </div>
      `).join('')}

  </div>

</div>
`
          });

          // ALSO bind errors to form
          Object.entries(response.data).forEach(([field, value]: any) => {
            const control = this.registerForm.get(field);

            if (control) {
              control.setErrors({
                backend: value?.message || 'Invalid value'
              });
              control.markAsTouched();
            }
          });

          return;
        }

        // =========================
        // CASE 2: Normal error
        // =========================
        Swal.fire({
          icon: 'error',
          title: response?.message || 'Something went wrong',

          confirmButtonText: 'OK',

        });
      }
    });
  }

  // =========================
  // UI ACTIONS
  // =========================
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  return(): void {
    this.router.navigate(['users/users_list']);
  }
}