import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { patient_filter, patient_List } from '../../patients.model';
import { PatientService } from '../../services/patient-service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  imports: [FormsModule, RouterModule, MatPaginatorModule, CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
  encapsulation: ViewEncapsulation.None

})
export class List implements OnInit {
  isLoading = false;
  pageIndex = 0;
  pageSizeOptions = [1, 25, 50];

  filter: patient_filter = {};

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

}