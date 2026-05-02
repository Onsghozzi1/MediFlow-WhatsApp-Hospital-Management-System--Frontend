import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Forgotpassword } from './pages/forgotpassword/forgotpassword';

export const AUTH_ROUTES: Routes = [
   { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'forgotpassword', component: Forgotpassword },
  { path: '', redirectTo: 'login', pathMatch: 'full' } // optional but recommended
];