import { Routes } from '@angular/router';
import { List } from './pages/list/list';
import { Add } from './pages/add/add';

export const PATIENTS_ROUTES: Routes = [
  { path: 'list', component: List },
  { path: 'add', component: Add },
  { path: 'edit/:id', component: Add }
];