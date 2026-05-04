import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { patient_filter } from '../patients.model';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Router } from '@angular/router';
import { API_ENDPOINTS } from '../../../core/services/endpoints';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(
    private apiService: ApiService
  ) { }

  GetPatientList(pageNo: number, pageSize: number, filtre?: patient_filter): Observable<any> {
    let params = new HttpParams()
      .set('pageNo', `${pageNo}`)
      .set('pageSize', `${pageSize}`)
    return this.apiService.post(API_ENDPOINTS.PATIENTS.BASE + API_ENDPOINTS.PATIENTS.GETALL, filtre, params);
  }

  Add_Patient(PatientDTO: any) {
    return this.apiService.post(API_ENDPOINTS.PATIENTS.BASE + API_ENDPOINTS.PATIENTS.POST, PatientDTO);
  }
  // =========================
  // UPDATE PATIENT
  // =========================
  edit_Patient(id: number, dto: any) {
    return this.apiService.put(API_ENDPOINTS.PATIENTS.BASE +
      API_ENDPOINTS.PATIENTS.PUT + `/${id}`,
      dto
    );
  }
  deletePatient(id: number): Observable<any> {
    return this.apiService.put(
      `${API_ENDPOINTS.PATIENTS.BASE}/${id}${API_ENDPOINTS.PATIENTS.DELETE}`,
      {}
    );
  }

}
