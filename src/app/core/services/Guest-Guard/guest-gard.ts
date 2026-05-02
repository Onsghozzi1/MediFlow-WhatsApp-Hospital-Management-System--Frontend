import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserStoreService } from '../user-store/user-store-service';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {

  constructor(private userStore: UserStoreService, private router: Router) { }

  canActivate(): boolean {
    if (this.userStore.isAuthenticated()) {
      // Déjà connecté → forcer navigation vers /welcome
      this.router.navigate(['/dashboard']);
      return false; // Bloque /login
    }
    return true; // Autorisé si pas connecté
  }
}
