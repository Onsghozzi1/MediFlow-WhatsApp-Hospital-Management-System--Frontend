import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { UserStoreService } from '../services/user-store/user-store-service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private userStore: UserStoreService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.userStore.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Vérification des rôles si data.roleTypes est défini
    const allowedRoles = route.data['roleTypes'] as string[] | undefined;
    if (allowedRoles?.length) {
      const userRoles = this.userStore.getUser()?.roleTypes || [];
      const match = userRoles.some((r: string) => allowedRoles.includes(r));
      if (!match) {
        this.router.navigate(['/forbidden']); // page accès refusé
        return false;
      }
    }

    return true;
  }
}
