import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { API_ENDPOINTS } from '../../../core/services/endpoints';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Consultations {
  constructor(
    private apiService: ApiService
  ) { }

  saveAnswer(data: any) {
    return this.apiService.post(`${API_ENDPOINTS.Consultations.base + API_ENDPOINTS.Consultations.POST}`, data);
  }
    GetConsultationsList(pageNo: number, pageSize: number, filtre?: any): Observable<any> {
    let params = new HttpParams()
      .set('pageNo', `${pageNo}`)
      .set('pageSize', `${pageSize}`)
    return this.apiService.post(API_ENDPOINTS.Consultations.base + API_ENDPOINTS.Consultations.GETALL, filtre, params);
  }
  startConsultation(appointmentId: number) {
  return this.apiService.post<any>(
    `${API_ENDPOINTS.Consultations.base}/start/${appointmentId}`,
    {}
  );
}

endConsultation(consultationId: number) {
  return this.apiService.post<void>(
    `${API_ENDPOINTS.Consultations.base}/end/${consultationId}`,
    {}
  );
}
}
