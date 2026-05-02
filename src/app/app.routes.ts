import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login/login';
import { Signup } from './features/auth/pages/signup/signup';
import { AuthGuard } from './core/auth/auth-guard';
import { GuestGuard } from './core/services/Guest-Guard/guest-gard';

export const routes: Routes = [

  // 🔐 Auth (no navbar)
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.routes')
        .then(m => m.AUTH_ROUTES),
    canActivate: [GuestGuard]
  },

  // 🏥 App (with navbar layout)
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component')
        .then(m => m.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes')
            .then(m => m.DASHBOARD_ROUTES)
      }
    ]
  },

  // 🔁 Default redirect
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  }
];