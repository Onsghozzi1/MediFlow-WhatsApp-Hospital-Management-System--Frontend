import { Routes } from '@angular/router';
import { ListAppointment } from './pages/list-appointment/list-appointment';
import { AddAppointment } from './pages/add-appointment/add-appointment';


export const Appointment_ROUTES: Routes = [
  { path: 'list', component: ListAppointment },
  { path: 'add', component: AddAppointment },
  { path: 'edit/:id', component: AddAppointment }
];