import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../services/patient-service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs';
import { patient_filter } from '../../patients.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule],
  templateUrl: './add.html',
  styleUrl: './add.css',
})
export class Add implements OnInit {

  patientForm!: FormGroup;
  isLoading = false;
  patientId: number | null = null;

  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUserIfEdit();
  }

  // =========================
  // INIT FORM
  // =========================
  initForm(): void {
    this.patientForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: [''],
      whatsappNumber: [''],
      birthDate: [null],
      gender: [''],
      address: ['']
    });
  }

  // =========================
  // LOAD PATIENT (EDIT MODE)
  // =========================
  private loadUserIfEdit(): void {
    this.route.params.pipe(
      map(params => Number(params['id'])),
      tap(id => this.patientId = isNaN(id) ? null : id),
      filter(id => !!id && !isNaN(id)),
      switchMap(id =>
        
        this.patientService.GetPatientList(0, 1, { id })
      ),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data: any) => {
        const patient = data?.content?.[0];
        if (!patient) return;

        this.patientForm.patchValue({
          fullName: patient.fullName,
          phone: patient.phone,
          whatsappNumber: patient.whatsappNumber,
          birthDate: patient.birthDate,
          gender: patient.gender,
          address: patient.address
        });
      },
      error: err => console.error('Load patient error:', err)
    });
  }

  // =========================
  // SUBMIT (ADD + EDIT)
  // =========================
onSubmit(): void {

  if (this.patientForm.invalid) {
    this.patientForm.markAllAsTouched();
    Swal.fire('Warning', 'Fill required fields', 'warning');
    return;
  }

  this.isLoading = true;

  const payload = this.patientForm.value;

  const request$ = this.patientId
    ? this.patientService.edit_Patient(this.patientId, payload)
    : this.patientService.Add_Patient(payload);

  request$.subscribe({
    next: (res: any) => {

      this.isLoading = false;

      Swal.fire({
        icon: 'success',
        title: this.patientId ? 'Patient updated' : 'Patient created',
        timer: 1500,
        showConfirmButton: false
      });

      this.router.navigate(['/patients/list']);
    },

    error: (err) => {
      this.isLoading = false;

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err?.error?.message || 'Something went wrong'
      });
    }
  });
}


  // =========================
  // CANCEL
  // =========================
  cancel(): void {
    this.router.navigate(['/patients/list']);
  }

  // label dynamic
  get isEdit(): boolean {
    return !!this.patientId;
  }
}