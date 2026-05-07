import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Appointment } from '../../Service/appointment';
import { appointment_filter, appointment_List, AppointmentStatus, AppointmentType, Priority } from '../../appointments.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, startWith } from 'rxjs';
import { PatientService } from '../../../patients/services/patient-service';

@Component({
  selector: 'app-list-appointment',
  imports: [CommonModule, MatPaginatorModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './list-appointment.html',
  styleUrl: './list-appointment.css',
})
export class ListAppointment implements OnInit {

  isLoading = false;
  pageIndex = 0;
  pageSizeOptions = [1, 25, 50];


  patient_Control = new FormControl('');
  date_Control= new FormControl(null);
  priority_Control = new FormControl(null);
  status_Control = new FormControl(null);
  type_Control = new FormControl(null);

  filteredPatients$!: Observable<any[]>;
  patientsList: any[] = [];
  filter: appointment_filter = {
    patient_name: '',
    id: 0,
    appointmentDate: null,
    priority: null,
    status: null,
    appointment_Type: null
  };
  Priority = Priority;
  AppointmentStatus = AppointmentStatus;
  AppointmentType = AppointmentType;

  List_appointments: appointment_List = {
    content: [],
    pageNo: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    last: true,
    total_Appointments: 0,
    completed: 0,
    upcoming: 0,
    today_Appointments: 0
  };


  constructor(
    private appointmentService: Appointment,
    private route: Router,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  // 🔄 GET DATA
  getData() {
    this.isLoading = true;

    this.appointmentService.GetAllPatientsApoinment().subscribe(data => {
      this.patientsList = data;
      this.filtred_patient()
      console.log("patient " + JSON.stringify(data))

    })

    this.appointmentService.GetAppointmentList(
      this.List_appointments.pageNo,
      this.List_appointments.pageSize,
      this.filter
    ).subscribe({
      next: (data: any) => {
        this.List_appointments = {
          content: data.content,
          pageNo: data.pageNo,
          pageSize: data.pageSize,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          last: data.last,
          total_Appointments: data.total_Appointments,
          completed: data.completed,
          upcoming: data.upcoming,
          today_Appointments: data.today_Appointments
        };

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  // 📄 PAGINATION
  handlePageEvent(e: PageEvent): void {
    this.List_appointments.pageNo = e.pageIndex;
    this.List_appointments.pageSize = e.pageSize;
    this.getData();
  }

  // ➕ ADD
  go() {
    this.route.navigate(['appointments/add']);
  }

  // ✏️ EDIT
  edit_appointment(appointmentId: number) {
    this.route.navigate(['appointments/edit', appointmentId]);
  }

  // ❌ DELETE
  delete_appointment(appointment_id: number) {

    Swal.fire({
      title: "Are you sure?",
      text: "This appointment will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel"
    }).then((result) => {

      if (result.isConfirmed) {

        this.appointmentService.delete_Appointment(appointment_id)
          .subscribe({
            next: (res: any) => {

              Swal.fire({
                title: res.message,
                text: res?.code || "****",
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
          text: "Appointment is safe 🙂",
          icon: "info"
        });

      }

    });
  }

  snooze_reminder(patientId: any) {

    this.appointmentService.sendWhatsApp(patientId).subscribe({

      next: (data: any) => {
        console.log(data);
        window.open(data.url, '_blank');
        console.log("WhatsApp URL:", JSON.stringify(data));

        Swal.fire({
          icon: 'success',
          title: 'WhatsApp Ready 📱',
          text: 'Message prepared successfully!',
          confirmButtonColor: '#22c55e'
        });

        // open whatsapp link
        window.open(data, '_blank');

      },

      error: (err) => {

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something went wrong!',
          confirmButtonColor: '#ef4444'
        });

        console.error(err);

      }

    });
  }
  filtred_patient() {
    this.filteredPatients$ = this.patient_Control.valueChanges.pipe(
      startWith(''),
      map(value => this.filterPatients(value))
    );
  }
  // 👇 Filter logic
  private filterPatients(value: any): any[] {
    const query = typeof value === 'string'
      ? value.toLowerCase()
      : value?.fullName?.toLowerCase() || '';
    return this.patientsList.filter(p =>
      p.fullName.toLowerCase().includes(query)
    );
  }
  // 👇 Display patient name in input
  display_patient(patient: any): string {
    return patient ? patient.fullName : '';

  }
  onPatientSelected(patient: any) {
    console.log("patient name " + JSON.stringify(patient.fullName))
    this.filter.patient_name = patient.fullName
    this.getData()
    this.patient_Control.setValue(patient);
  }
  search_data(): void {
  console.log("this.filter.Priority "+this.priority_Control.value)
    this.filter.patient_name = this.patient_Control.value || '';
    this.filter.appointmentDate=this.date_Control.value ;
    this.filter.priority=this.priority_Control.value
    this.filter.status=this.status_Control.value
    this.filter.appointment_Type=this.type_Control.value
    this.appointmentService.GetAppointmentList(
      this.List_appointments.pageNo,
      this.List_appointments.pageSize,
      this.filter
    ).subscribe({

      next: (data: any) => {

        this.List_appointments = {
          content: data.content,
          pageNo: data.pageNo,
          pageSize: data.pageSize,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          last: data.last,
          total_Appointments: data.total_Appointments,
          completed: data.completed,
          upcoming: data.upcoming,
          today_Appointments: data.today_Appointments
        };

      },

      error: (err) => {
        console.error(err);
      }

    });

  }

}