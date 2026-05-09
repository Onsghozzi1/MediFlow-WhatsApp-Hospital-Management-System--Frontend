import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Landingpage } from '../../services/landingpage';
import { AppointmentType, Priority } from '../../../appointments/appointments.model';

@Component({
  selector: 'app-appointment-card',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointment-card.html',
  styleUrl: './appointment-card.css',
})
export class AppointmentCard implements OnInit {
  Priority = Priority;
  appointmentForm!: FormGroup;
  AppointmentType = AppointmentType;
  isLoading = false;
  showToast = false;
  toast = {
    show: false,
    message: '',
  type: 'success' as 'success' | 'error'
  };
  constructor(
    private fb: FormBuilder,
    private service: Landingpage
  ) {}

  ngOnInit(): void {

    this.initForm();

  }

  private initForm(): void {

    this.appointmentForm = this.fb.group({

      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      reason: [null, Validators.required],
      appointmentDate: [ Validators.required],
      consultMode: [null, Validators.required]

    });

  }
  onSubmit(): void {

    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    const payload = this.appointmentForm.value;
    this.isLoading = true;

    this.service.Add_Appointment_Patient(payload).subscribe({
      next: () => {
        this.handleSuccess();
      },
      error: (err) => {
        console.error(err);
        this.handleError(err)
        this.isLoading = false;
      }
    });
  }


private handleSuccess(): void {

  this.isLoading = false;

  // reset form
  this.appointmentForm.reset({
    consultMode: null
  });

  // show toast
  this.toast.message = 'Appointment created successfully 🎉';
  this.toast.type = 'success';
  this.toast.show = true;

  // auto hide after 3s
  setTimeout(() => {
    this.toast.show = false;
  }, 3000);
}
private handleError(err: any): void {

  this.isLoading = false;

  const apiError = err?.error;


      this.toast.message =  err?.error?.message || 'Server error';
  

  this.toast.type = 'error';
  this.toast.show = true;
  
  // auto hide after 3s
  setTimeout(() => {
    this.toast.show = false;
  }, 3000);
}
}