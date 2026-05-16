import { Injectable, signal } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UserStoreService } from '../user-store/user-store-service';
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from './../endpoints';
import { MatDialog } from '@angular/material/dialog';

export interface User {
  idUser?: number;
  profilePicture?: string;
  access_token?: string;
  roleTypes?: string | string[];
  expires_at?: number;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USER_KEY = 'user';
  private readonly TRANCHE_KEY = 'tranches';
  private readonly lOCATION_KEY = 'locationCounts';
  private readonly paymentStatusCount_dto = 'paymentStatusCount_dto';
  private readonly payements_KEY = 'payements_Counts';

  private logoutTimer: any;
  private userKey = 'user';

  //isAuthenticated = signal<boolean>(!!localStorage.getItem(this.USER_KEY));
  isAuthenticated = signal<boolean>(false);

  constructor(
    private apiService: ApiService,
    private router: Router,
    private userStoreService: UserStoreService,
    private dialog: MatDialog,

  ) {
    this.initAuth();
  }

  /** Initialize auth state on app startup */
  private initAuth(): void {
    const user = this.getStoredUser();
    if (user && user.expires_at && Date.now() < user.expires_at) {
      this.isAuthenticated.set(true);
      this.userStoreService.setUser(user);
      this.startAutoLogoutTimer(user.expires_at);
    } else {
      this.logout(); // ✅ nettoie si expiré ou invalide
    }
  }

  /** Get user from localStorage safely */
  private getStoredUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }


  /** Save user to localStorage and update UserStore */
  private saveUser(user: User): void {

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.userStoreService.setUser(user);
    this.isAuthenticated.set(true);
  }

  /** Login API call */
  /** Login API call */
  login(email: string, password: string): Observable<User> {
    return this.apiService
      .postWithoutAuth<{ user: any; jwtToken: string }>(API_ENDPOINTS.AUTH.LOGIN, { email, password })
      .pipe(

        tap((response) => {
          if (!response) {
            throw new Error('No response received from server');
          }


          const { user, jwtToken } = response;
          const userData: User = {
            ...user,
            access_token: jwtToken,
            expires_at: Date.now() + 3600 * 1000, // 1h
          };

          this.saveUser(userData); // ✅ enregistré seulement ici
          this.startAutoLogoutTimer(userData.expires_at!);
        })
      );
  }

  /** Auto logout when token expires */
  private startAutoLogoutTimer(expiresAt: number): void {
    this.clearLogoutTimer();
    const timeRemaining = expiresAt - Date.now();

    if (timeRemaining <= 0) {
      this.logout();
      return;
    }

    this.logoutTimer = setTimeout(() => {
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'Your session has expired. Please log in again.',
      
      }).then(() => this.logout());
    }, timeRemaining);
  }

  /** Clear auto logout timer */
  private clearLogoutTimer() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }
  /** Logout user */
  logout(): void {
  
    this.clearLogoutTimer();
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticated.set(false);
    this.userStoreService.setUser(null);
      // Close all dialogs
    this.dialog.closeAll();

    // Close SweetAlert if opened
    Swal.close();
    this.router.navigate(['/login']);
  }

  /** Update user profile */
  updateUser(userDto: Partial<User>): Observable<User> {
    return this.apiService.put<User>('auth/updateUser', userDto).pipe(
      tap((updatedUser) => {
        const oldUser = this.getStoredUser() || {};
        const mergedUser = {
          ...oldUser,
          ...updatedUser,
          access_token: oldUser.access_token,
          expires_at: oldUser.expires_at,
        };
        this.saveUser(mergedUser);
        console.log('🔄 User profile updated');
      })
    );
  }

  /** Roles & token helpers */
  getToken(): string | null {
    return this.getStoredUser()?.access_token || null;
  }

  getRoles(): string[] {
    const roles = this.getStoredUser()?.roleTypes;
    if (!roles) return [];
    return Array.isArray(roles) ? roles : [roles];
  }

  roleMatch(allowedRoles: string[]): boolean {
    const userRoles = this.getRoles();
    return userRoles.some(r => allowedRoles.includes(r));
  }
  forgotPassword(email: string): Observable<any> {
    return this.apiService.post(`auth/forgot-password?email=${email}`, '');
  }
}
