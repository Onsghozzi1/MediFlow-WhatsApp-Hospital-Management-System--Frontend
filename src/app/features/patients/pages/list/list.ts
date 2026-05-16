import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { Gender, patient_filter, patient_List } from '../../patients.model';
import { PatientService } from '../../services/patient-service';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-list',
  imports: [FormsModule, RouterModule, MatPaginatorModule, CommonModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],

  templateUrl: './list.html',
  styleUrl: './list.css',
  encapsulation: ViewEncapsulation.None

})
export class List implements OnInit {
  isLoading = false;
  pageIndex = 0;
  pageSizeOptions = [1, 5, 10, 25, 50];
  patientsList: any[] = [];
  gender = Gender
  medicalRecordIds: string[] = [];
  fullNames: string[] = [];
  phones: string[] = [];
  addresses: string[] = [];
  filter: patient_filter = {
    id: 0,
    medicalRecordIds: '',
    full_name: '',
    phone: '',
    address: '',
    gender: null
  };
  patient_Control = new FormControl<string>('');
  fullname_Control = new FormControl<string>('');
  phone_Control = new FormControl<string>('');
  address_Control = new FormControl<string>('');
  gender_Control = new FormControl(null);


  filteredPatients$!: Observable<any[]>;
  fullnamePatients$!: Observable<any[]>;
  phonePatients$!: Observable<any[]>;
  address_Patients$!: Observable<any[]>;



  List_patients: patient_List = {
    content: [],
    pageNo: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    last: true,
    totalMale: 0,
    totalFemale: 0
  };

  constructor(private patientService: PatientService, private route: Router) { }
  ngOnInit(): void {
    this.getData()
    this.getListPatient()
  }
  // Pagination and data
  getData() {
    this.isLoading = true;
    this.patientService.GetPatientList(
      this.List_patients.pageNo,
      this.List_patients.pageSize,
      this.filter
    ).subscribe({
      next: (data: any) => {
        this.List_patients = {
          content: data.content,
          pageNo: data.pageNo,
          pageSize: data.pageSize,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          last: data.last,
          totalMale: data.totalMale,
          totalFemale: data.totalFemale

        };
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }


  handlePageEvent(e: PageEvent): void {
    this.List_patients.pageNo = e.pageIndex;
    this.List_patients.pageSize = e.pageSize;
    this.getData();
  }
  go() {
    this.route.navigate(['patients/add'])
  }
  edit_patient(patientId: Number) {
    this.route.navigate(['patients/edit', patientId]);
  }
  gotoAppointment(patientId: Number) {
    this.route.navigate(['appointments/edit-by-patient', patientId]);
  }


  delete_patient(patient_id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "This patient will be archived (you can restore later).",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel"

    }).then((result) => {

      if (result.isConfirmed) {

        this.patientService.deletePatient(patient_id)
          .subscribe({
            next: (res: any) => {

              Swal.fire({
                title: "Deleted!",
                text: res?.message || "Patient deleted successfully",
                icon: "success"
              });

              this.getData(); // 🔄 refresh list
            },

            error: (err) => {

              Swal.fire({
                title: "Error!",
                text: err?.error?.message || "Something went wrong",
                icon: "error"
              });

              console.error(err);
            }
          });

      } else if (result.dismiss === Swal.DismissReason.cancel) {

        Swal.fire({
          title: "Cancelled",
          text: "Patient is safe 🙂",
          icon: "info"
        });

      }

    });
  }

  
  // =========================
  // LOAD PATIENT FILTER DATA
  // =========================
  getListPatient() {
    this.isLoading = true;

    this.patientService.GetAllList().subscribe({
      next: (data: any) => {

        // =========================
        // EXTRACT EACH LIST
        // =========================
        this.medicalRecordIds = data?.medicalRecordIds || [];
        this.fullNames = data?.full_name || [];
        this.phones = data?.phone || [];
        this.addresses = data?.address || [];

        // =========================
        // AUTOCOMPLETE INIT (names)
        // =========================
        this.filtred_patient();
        this.filtred_fullname();
        this.filtred_phone();
        this.filtred_address();
        this.isLoading = false;
      },

      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
  filtred_patient() {
    this.filteredPatients$ = this.patient_Control.valueChanges.pipe(
      startWith(''),
      map(value => this.filterPatients(value))
    );
  }

  display_patient(value: string): string {
    return value || '';
  }
  private filterPatients(value: string | null): string[] {

    const query = (value ?? '').toLowerCase().trim();

    return this.medicalRecordIds.filter(p =>
      p.toLowerCase().includes(query)
    );

  }


  onPatientSelected(patient: any) {
    console.log("patient name " + JSON.stringify(patient.fullName))
    //   this.filter.patient_name = patient.fullName
    this.getData()
    this.patient_Control.setValue(patient);
  }
  filtred_phone() {
    this.phonePatients$ = this.phone_Control.valueChanges.pipe(
      startWith(''),
      map(value => this.filterPhones(value))
    );
  }

  private filterPhones(value: any): string[] {
    const query = (value || '').toLowerCase();
    return this.phones.filter(p =>
      p.toLowerCase().includes(query)
    );
  }
  display_phone(patient: any): string {
    return patient;
  }
  filtred_address() {
    this.address_Patients$ = this.address_Control.valueChanges.pipe(
      startWith(''),
      map(value => this.filterAddresses(value))
    );
  }
  display_Addresses(patient: any): string {
    return patient;
  }
  private filterAddresses(value: any): string[] {
    const query = (value || '').toLowerCase();
    return this.addresses.filter(p =>
      p.toLowerCase().includes(query)
    );
  }
  display_fullname(patient: any): string {
    return patient;
  }
  filtred_fullname() {
    this.fullnamePatients$ = this.fullname_Control.valueChanges.pipe(
      startWith(''),
      map(value => this.filterFullnames(value))
    );
  }

  private filterFullnames(value: any): string[] {
    const query = (value || '').toLowerCase();
    return this.fullNames.filter(p =>
      p.toLowerCase().includes(query)
    );
  }


  // =========================
  // SEARCH & FILTER PATIENTS
  // =========================
  search_data(): void {
    // Assign filter values from form controls

    this.filter.medicalRecordIds = this.patient_Control.value || '';
    this.filter.full_name = this.fullname_Control.value;
    this.filter.gender = this.gender_Control.value;
    this.filter.phone = this.phone_Control.value
    this.filter.address = this.address_Control.value

    // Call API to retrieve filtered patient list
    this.patientService.GetPatientList(
      this.List_patients.pageNo,
      this.List_patients.pageSize,
      this.filter
    ).subscribe({

      next: (data: any) => {

        this.List_patients = {
          content: data.content,
          pageNo: data.pageNo,
          pageSize: data.pageSize,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          last: data.last,
          totalMale: data.totalMale,
          totalFemale: data.totalFemale

        };

      },

      error: (err) => {
        console.error(err);
      }

    });

  }
}