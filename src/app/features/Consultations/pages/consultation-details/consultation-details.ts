import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Consultations } from '../../services/consultations';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultation-details',
  imports: [CommonModule],
  templateUrl: './consultation-details.html',
  styleUrl: './consultation-details.css',
})
export class ConsultationDetails implements OnInit {
  consultationId: any;
  patient_list:any;
  prescription_list:any;
appointment: any;
  private destroyRef = inject(DestroyRef);
  doctor_list: any;
  list_appoi: any;

  constructor(
    private consultations_Service: Consultations,
    private router: Router,
    private route: ActivatedRoute,
  ) { }
  ngOnInit(): void {
    this.loadConsultation()
  }

  private loadConsultation(): void {

    this.route.params.pipe(

      map(params => Number(params['id'])),
      tap(id => {
        if (id) {
          this.consultationId = id; // ✅ THIS IS THE FIX

        } else {
          this.consultationId = null
        }
        console.log('SET consultationId:', this.consultationId);
      }),

      filter(id => !!id && !isNaN(id)),

      switchMap(id =>
        this.consultations_Service.GetConsultationsList(0, 1, { id })
      ),

      takeUntilDestroyed(this.destroyRef)

    ).subscribe({
      next: (response: any) => {

        // ✅ IMPORTANT
        const appointment = response?.content?.[0];
        this.patient_list=appointment.patient
        this.doctor_list=appointment.doctor
        this.prescription_list=appointment.dto
        this.appointment=response?.content[0]
        this.list_appoi=appointment.appointment
        console.log("appointment:", appointment);

      },

      error: err => console.error('Load appointment error:', err)
    });
  }
back(){
  this.router.navigate(['/Consultation/list'])
}
}
