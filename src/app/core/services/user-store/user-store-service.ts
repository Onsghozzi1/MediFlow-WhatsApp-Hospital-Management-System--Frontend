import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private userSignal = signal<any | null>(null);
  USER_KEY: any = 'user'
  constructor(private router: Router) {
    const userData = localStorage.getItem('user');

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);

        // Vérifier si expires_at existe et s'il est expiré
        if (!parsedUser.expires_at || parsedUser.expires_at < Date.now()) {
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
          return;
        }

        // Sinon, tout est bon → garder l'utilisateur
        this.userSignal.set(parsedUser);

      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
      }
    }
  }

  setUser(user: any | null): void {
    this.userSignal.set(user);
  }
  set(user: any) {

    if (!user?.access_token) return;

    this.userSignal.set(user);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
  getUser() {
    return this.userSignal();
  }

  isAuthenticated(): boolean {
    return !!this.userSignal();
  }
}
