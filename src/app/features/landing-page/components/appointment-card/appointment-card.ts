import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Landingpage } from '../../services/landingpage';
import { AppointmentType, Priority } from '../../../appointments/appointments.model';

@Component({
  selector: 'app-appointment-card',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
    private service: Landingpage,

  ) { }

  ngOnInit(): void {

    this.initForm();
const today = new Date().toISOString().split('T')[0];
this.generateSlots(today);
  }

  private initForm(): void {

    this.appointmentForm = this.fb.group({

      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      reason: [null, Validators.required],
      appointmentDate: [Validators.required],
      consultMode: [null, Validators.required],
      selectedDate: [null],
      gender:[null],
      birthDate:[null],
      // 👇 NEW CONTROLS
      selectedSlot: ["", Validators.required],
    });

  }
  onSubmit(): void {

    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }
    const form = this.appointmentForm.value;

 
const appointmentDate = `${form.selectedDate}T${form.selectedSlot}`;
    const payload = {
      fullName: form.fullName,
      phone: form.phone,
      reason: form.reason,
      consultMode: form.consultMode,
      appointmentDate: appointmentDate,
      gender:form.gender,
      birthDate:form.birthDate
    };
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


    this.toast.message = err?.error?.message || 'Server error';


    this.toast.type = 'error';
    this.toast.show = true;

    // auto hide after 3s
    setTimeout(() => {
      this.toast.show = false;
    }, 3000);
  }
  timeSlots: string[] = [];
selectedDate!: string;

// disponibilité par jour
availability: Record<number, { start: number; end: number; breaks?: number[] }> = {
  1: { start: 8, end: 18, breaks: [12, 13] }, // Monday
  2: { start: 8, end: 18, breaks: [12, 13] }, // Tuesday
  3: { start: 8, end: 18, breaks: [12, 13] }, // Wednesday
  4: { start: 8, end: 18, breaks: [12, 13] }, // Thursday
  5: { start: 8, end: 18, breaks: [12, 13] }, // Friday
  6: { start: 8, end: 13 }, // Saturday
  0: { start: 0, end: 0 } // Sunday fermé
};

// slots déjà réservés depuis API
bookedSlots: string[] = [];


onDateChange(event: any) {
  this.selectedDate = event.target.value;
   
  this.service.getBookedSlots(this.selectedDate).subscribe({
    next: (slots: string[]) => {
      this.bookedSlots = slots;
      this.generateSlots(this.selectedDate);
    }
  });
}

generateSlots(date: string) {
  this.timeSlots = [];

  const selected = new Date(date);

  // 0 = Sunday, 1 = Monday ...
  const day = selected.getDay();

  const config = this.availability[day];

  // jour fermé
  if (!config || config.start === config.end) {
    return;
  }

  for (let h = config.start; h < config.end; h++) {

    // skip breaks
    if (config.breaks?.includes(h)) continue;

    const slot1 = `${this.format(h)}:00`;
    const slot2 = `${this.format(h)}:30`;

    // éviter les slots déjà réservés
    if (!this.bookedSlots.includes(slot1)) {
      this.timeSlots.push(slot1);
    }

    if (!this.bookedSlots.includes(slot2)) {
      this.timeSlots.push(slot2);
    }
  }
}


  format(h: number) {
    return h < 10 ? '0' + h : '' + h;
  }
  selectedSlot!: string;

  selectSlot(slot: string) {
    console.log("selected slots "+slot)
    this.selectedSlot = slot;
  }
  openCalendar(input: HTMLInputElement) {
  input.showPicker?.(); // méthode moderne
}
}