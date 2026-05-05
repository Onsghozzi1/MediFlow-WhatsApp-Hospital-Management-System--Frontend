import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, filter, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { AppointmentStatus, AppointmentType, Doctor, Patient, Priority, TimeSlot } from '../../appointments.model';
import { PatientService } from '../../../patients/services/patient-service';
import { UserStore } from '../../../../core/auth/user.store';
import { Appointment } from '../../Service/appointment';
import Swal from 'sweetalert2';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-add-appointment',
  imports: [CommonModule, ReactiveFormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule],
  templateUrl: './add-appointment.html',
  styleUrl: './add-appointment.css',
})
export class AddAppointment {
  AppointmentStatus = AppointmentStatus;
  AppointmentType = AppointmentType;
  Priority = Priority;
  avgWaitTime: any = 0;
  availableSlotsToday: any = 0;
  todayAppointmentsCount: any = 0;
  searchPatientControl = new FormControl('');
  filteredPatients$!: Observable<Patient[]>;
  selectedPatient: Patient | null = null;
  private userStore = inject(UserStore);
  user = this.userStore.user$;
  private destroyRef = inject(DestroyRef);

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  appointmentForm!: FormGroup;
  isEditMode = false;
  appointmentId: number | null = null;
  isSubmitting = false;

  // Data lists
  patientsList: Patient[] = [];
  filteredPatients: Patient[] = [];
  doctorsList: Doctor[] = [];
  availableTimeSlots: TimeSlot[] = [];


  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private appointment_service: Appointment,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadAppointmentIfEdit()
    // Load patients
    this.patientService.GetAllPatients().subscribe(data => {
      this.patientsList = data;
      this.filteredPatients$ = this.searchPatientControl.valueChanges.pipe(
        startWith(''),
        map(value => this.filterPatients(value))
      );
    });

    // 👇 Listen for selection
    this.searchPatientControl.valueChanges.subscribe((value: any) => {
      if (value && typeof value === 'object') {
        this.appointmentForm.patchValue({
          patientId: value.patientId
        });
      }
    });
  }

  initForm() {
    this.appointmentForm = this.fb.group({
      patientId: [0],
      doctorEmail: [this.user().email],
      appointmentDate: [],
      status: [AppointmentStatus.PENDING],
      appointmentType: [null],
      priority: [Priority.NORMAL],
      reason: [''],
      notes: ['']
    });
  }
  private loadAppointmentIfEdit(): void {
    this.route.params.pipe(
      map(params => Number(params['id'])),
      tap(id => this.appointmentId = isNaN(id) ? null : id),
      filter(id => !!id && !isNaN(id)),

      switchMap(id =>

        this.appointment_service.GetAppointmentList(0, 1, { id })
      ),

      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response: any) => {

        const appointment = response?.content?.[0]; // 🔥 FIX ICI

        if (!appointment) return;

        this.appointmentForm.patchValue({

          patientId: appointment.patientId,

          appointmentDate: appointment.appointmentDate,
          appointmentType: appointment.appointmentType,

          status: appointment.status,
          priority: appointment.priority,

          reason: appointment.reason,
          notes: appointment.notes
        });

        // autocomplete display (important fix)
        this.myControl.setValue({
          patientId: appointment.patientId,
          fullName: appointment.patient_name
        });
      },

      error: err => console.error('Load appointment error:', err)
    });
  }
  // 👇 Display patient name in input
  displayPatient(patient: Patient): string {
    return patient ? patient.fullName : '';
  }
  // 👇 Filter logic
  private filterPatients(value: any): Patient[] {
    const query = typeof value === 'string'
      ? value.toLowerCase()
      : value?.fullName?.toLowerCase() || '';
    return this.patientsList.filter(p =>
      p.fullName.toLowerCase().includes(query)
    );
  }

  onPatientSelected(patient: any) {
    this.appointmentForm.patchValue({
      patientId: patient.patientId
    });
  }
  goBack() {
    this.router.navigate(['/appointments/list']);
  }
 onSubmit(): void {

  if (this.appointmentForm.invalid) {
    this.appointmentForm.markAllAsTouched();

    Swal.fire({
      icon: 'warning',
      title: 'Form Incomplete',
      text: 'Please fill all required fields'
    });

    return;
  }

  this.isSubmitting = true;

  const payload = this.appointmentForm.value;

  const request$ = this.appointmentId
    ? this.appointment_service.edit_Appointment(this.appointmentId, payload)
    : this.appointment_service.Add_Appointment(payload);

  request$.subscribe({

    next: (res: any) => {

      this.isSubmitting = false;

      Swal.fire({
        icon: 'success',
        title: this.appointmentId ? 'Appointment updated' : 'Appointment created',
        timer: 1500,
        showConfirmButton: false
      });

      this.router.navigate(['/appointments/list']);
    },

    error: (err: any) => {

      this.isSubmitting = false;

      const res = err?.error;
      const errors = res?.data;

      let message = '';

      if (errors) {
        message = Object.values(errors)
          .map((e: any) => `<div>${e.message}</div>`)
          .join('');
      }

      Swal.fire({
        icon: 'error',
        title: res?.code || 'Error',
        html: message || res?.message || 'Something went wrong'
      });

      console.error(err);
    }
  });
}
  getStatusClass(status: string) {
    return {
      PENDING: 'status-pending',
      CONFIRMED: 'status-confirmed',
      DONE: 'status-done',
      CANCELLED: 'status-cancelled'
    }[status] || '';
  } getPriorityClass(priority: string) {
    return {
      LOW: 'priority-low',
      NORMAL: 'priority-normal',
      HIGH: 'priority-high',
      URGENT: 'priority-urgent'
    }[priority] || '';
  }
  // label dynamic
  get isEdit(): boolean {
    return !!this.appointmentId;
  }

}
