import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { API_ENDPOINTS } from '../../../core/services/endpoints';

@Injectable({
  providedIn: 'root',
})
export class Landingpage {
  constructor(
    private apiService: ApiService
  ) { }
  Add_Appointment_Patient(AppointmentDTO: any) {
    return this.apiService.postWithoutAuth(API_ENDPOINTS.APPOINTMENTS_patient.BASE + API_ENDPOINTS.APPOINTMENTS_patient.POST, AppointmentDTO);
  }

  getBookedSlots(date: string) {
  return this.apiService.get<string[]>(
    `${API_ENDPOINTS.APPOINTMENTS_patient.BASE}/booked-slots?date=${date}`
  );
}
}
