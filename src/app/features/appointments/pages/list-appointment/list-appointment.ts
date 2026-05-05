import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Appointment } from '../../Service/appointment';
import { appointment_filter, appointment_List, AppointmentStatus } from '../../appointments.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-appointment',
  imports: [MatPaginatorModule,CommonModule],
  templateUrl: './list-appointment.html',
  styleUrl: './list-appointment.css',
})
export class ListAppointment implements OnInit {
  
  isLoading = false;
  pageIndex = 0;
  pageSizeOptions = [1, 25, 50];

  filter: appointment_filter = {};

  List_appointments: appointment_List = {
    content: [],
    pageNo: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    last: true,
    total_Appointments: 0,
    completed:0,
    upcoming:0,
    today_Appointments:0
  };


  constructor(
    private appointmentService: Appointment,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  // 🔄 GET DATA
  getData() {
    this.isLoading = true;

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
          total_Appointments:data.total_Appointments,
          completed:data.completed,
          upcoming:data.upcoming,
          today_Appointments:data.today_Appointments
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

}