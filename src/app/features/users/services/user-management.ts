import { Injectable, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { User_filter } from '../../../core/models/user.model';
import { catchError, Observable, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/services/endpoints';


@Injectable({
  providedIn: 'root',
})
export class UserManagement {

  private profile_pic = signal<any>(null);
  public profile_pic_data = this.profile_pic.asReadonly();
  updatPhoto(data: any) {
    this.profile_pic.set(data);
  }

  /*****************/
  private data_navbar = signal<any>(null);
  public data_navbar_data = this.data_navbar.asReadonly();
  updatdata_navbar(data: any) {
    this.data_navbar.set(data);
  }
  constructor(
    private apiService: ApiService,
    private router: Router,
  ) { }
  public user_signal = signal<any>(null);
  updateData(data: any) {
    this.user_signal.set(data);
  }

  GetUserList(pageNo: number, pageSize: number, filtre?: User_filter): Observable<any> {
    let params = new HttpParams()
      .set('pageNo', `${pageNo}`)
      .set('pageSize', `${pageSize}`)
    return this.apiService.post(API_ENDPOINTS.AUTH.USERList, filtre, params);
  }



  changeAccountStatus(userId: number, status: boolean): Observable<any> {
    return this.apiService.post(
      `userManagement/change-account-status?userId=${userId}&status=${status}`,
      null
    ).pipe(
      catchError(error => {
        return throwError(() => new Error('Failed to update status'));
      })
    );
  }
  deleteUserById(userId: number, status: boolean): Observable<any> {
    return this.apiService.post(
      `userManagement/delete-account-status?userId=${userId}&status=${status}`,
      null
    ).pipe(
      catchError(error => {
        return throwError(() => new Error('Failed to update status'));
      })
    );
  }
  registerAdmin(userRegisterDTO: any) {
    return this.apiService.postWithoutAuth<any>('auth/admin/register', userRegisterDTO);
  }
  changeRoles(userId: number, roles: String): Observable<any> {
    return this.apiService.post(
      `userManagement/change-role?userId=${userId}&roles=${roles}`,
      null
    ).pipe(
      catchError(error => {
        return throwError(() => new Error('Failed to update status'));
      })
    );
  }
  resolveUserByEmail(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.apiService.get(`userManagement/resolve`, params);
  }
  forgotPassword(email: string, passwordDto: any): Observable<void> {
    const params = new HttpParams().set('email', email);
    return this.apiService.post<void>(
      'userManagement/forgotPassword',
      passwordDto,
      params
    );
  }

}
