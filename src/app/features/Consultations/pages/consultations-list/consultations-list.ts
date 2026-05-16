import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConsultationShell } from '../consultation-shell/consultation-shell';
import { Consultations } from '../../services/consultations';
import { appointment_filter } from '../../../appointments/appointments.model';
import { consultation_filter, consultation_List } from '../../consultation.model';

@Component({
  selector: 'app-consultations-list',
  imports: [CommonModule, MatPaginatorModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './consultations-list.html',
  styleUrl: './consultations-list.css',
})
export class ConsultationsList {

  isLoading = false;
  pageIndex = 0;
  pageSizeOptions = [1, 25, 50];

  filter: consultation_filter = {

  };


  consultation_: consultation_List = {
    content: [],
    pageNo: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    last: true,
    total_Consultation: 0,
    today_Consultation: 0,
    completed: 0,
    upcoming: 0
  };


  constructor(
    private dialog: MatDialog,
    private consultations_Service: Consultations,
    private route: Router,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  // 🔄 GET DATA
  getData() {
    this.isLoading = true;


    this.consultations_Service.GetConsultationsList(
      this.consultation_.pageNo,
      this.consultation_.pageSize,
      this.filter
    ).subscribe({
      next: (data: any) => {
        this.consultation_ = {
          content: data.content,
          pageNo: data.pageNo,
          pageSize: data.pageSize,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          last: data.last,
          total_Consultation: data.total_Consultation,
          today_Consultation: data.today_Consultation,
          completed: data.completed,
          upcoming: data.upcoming


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
    this.consultation_.pageNo = e.pageIndex;
    this.consultation_.pageSize = e.pageSize;
    this.getData();
  }
  startConsultation(): void {

    const dialogRef = this.dialog.open(ConsultationShell, {
      width: '600px',
      disableClose: true,
      data: {
        message: 'Start new consultation',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getData()
      if (result) {


      }

    });

  }

}
