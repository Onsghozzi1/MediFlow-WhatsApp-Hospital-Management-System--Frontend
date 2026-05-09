
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../../core/services/endpoints';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Appointment {
  constructor(
    private apiService: ApiService
  ) { }

  GetAppointmentList(pageNo: number, pageSize: number, filtre?: any): Observable<any> {
    let params = new HttpParams()
      .set('pageNo', `${pageNo}`)
      .set('pageSize', `${pageSize}`)
    return this.apiService.post(API_ENDPOINTS.APPOINTMENTS.BASE + API_ENDPOINTS.APPOINTMENTS.GETALL, filtre, params);
  }

  Add_Appointment(AppointmentDTO: any) {
    return this.apiService.post(API_ENDPOINTS.APPOINTMENTS.BASE + API_ENDPOINTS.APPOINTMENTS.POST, AppointmentDTO);
  }
  // =========================
  // UPDATE Appointment
  // =========================
  edit_Appointment(id: number, dto: any) {
    return this.apiService.put(API_ENDPOINTS.APPOINTMENTS.BASE +
      API_ENDPOINTS.APPOINTMENTS.PUT + `/${id}`,
      dto
    );
  }

  // =========================
  // DELETE Appointment
  // =========================
  delete_Appointment(id: number): Observable<any> {
    return this.apiService.put(
      `${API_ENDPOINTS.APPOINTMENTS.BASE}/${id}${API_ENDPOINTS.APPOINTMENTS.DELETE}`,
      {}
    );
  }

  // =========================
  // GET LIST Appointment for calender
  // =========================

  Calender_data(): Observable<any> {
    return this.apiService.get<any>(`${API_ENDPOINTS.APPOINTMENTS.BASE}${API_ENDPOINTS.APPOINTMENTS.CALENDER}`);
  }

  // =========================
  // WATSAPP Appointment
  // =========================

sendWhatsApp(patientId: number) {

  const params = new HttpParams()
    .set('patientId', patientId);

  return this.apiService.get<any>(
    `${API_ENDPOINTS.APPOINTMENTS.BASE}${API_ENDPOINTS.APPOINTMENTS.WATSAPP}`,
    params
  );
}

GetAllPatientsApoinment(): Observable<any> {
  return this.apiService.get(
    `${API_ENDPOINTS.APPOINTMENTS.BASE}${API_ENDPOINTS.APPOINTMENTS.GETPatientAPPO}`
  );
}
  // =========================
  // GET AVAILABLE SLOTS
  // =========================

  getAvailableSlots(
    doctorId: number,
    date: string
  ): Observable<string[]> {
  const params = new HttpParams()
    .set('doctorId', doctorId)
    .set('date', date);
    return this.apiService.get<string[]>(
      `${API_ENDPOINTS.APPOINTMENTS.BASE}/slots`,
     params
    );
  }

  // =========================
  // CREATE APPOINTMENT
  // =========================

  createAppointment(data: any): Observable<any> {
  const params = new HttpParams()
    .set('doctorId', data.doctorId)
    .set('patientName', data.patientName)
    .set('date', data.date)
    .set('time', data.time);
    return this.apiService.post(
       `${API_ENDPOINTS.APPOINTMENTS.BASE}/create_appoint`,
      {params},
     
    );
  }
  moveAppointment(id: number, payload: any) {
  return this.apiService.put(
    `${API_ENDPOINTS.APPOINTMENTS.BASE}/${id}/move`,
    payload
  );
}
}