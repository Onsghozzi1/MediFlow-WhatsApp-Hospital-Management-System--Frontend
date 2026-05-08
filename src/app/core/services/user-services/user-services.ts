import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class UserServices {
    constructor(
    private apiService: ApiService,
  ) { }
    registerUser(userRegisterDTO: any) {
    return this.apiService.postWithoutAuth<any>('auth/user/client', userRegisterDTO);
  }

   registerAdmin(userRegisterDTO: any) {
    return this.apiService.postWithoutAuth<any>('auth/admin/register', userRegisterDTO);
  }



}
