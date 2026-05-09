import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { UserStoreService } from '../services/user-store/user-store-service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private userStore: UserStoreService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    // =========================
    // SAFE USER CHECK
    // =========================
    const user = this.userStore.getUser();
console.log("user data "+JSON.stringify(user))
    if (!user || !user.access_token) {
      this.router.navigate(['/login']);
      return false;
    }

    // =========================
    // ROLE CHECK
    // =========================
    const allowedRoles = route.data['roleTypes'] as string[] | undefined;

    if (allowedRoles?.length) {

      const userRoles = Array.isArray(user.roleTypes)
        ? user.roleTypes
        : [user.roleTypes];

      const match = userRoles.some((role:any) =>
        allowedRoles.includes(role)
      );

      if (!match) {
        this.router.navigate(['/forbidden']);
        return false;
      }
    }

    return true;
  }
}