import { Routes } from '@angular/router';
import { ListAppointment } from './pages/list-appointment/list-appointment';
import { AddAppointment } from './pages/add-appointment/add-appointment';
import { Calender } from './pages/calender/calender';


export const Appointment_ROUTES: Routes = [
  { path: 'list', component: ListAppointment },
  { path: 'add', component: AddAppointment },
  { path: 'edit/:id', component: AddAppointment },
  { path: 'edit-by-patient/:patientid', component: AddAppointment },
  { path: 'calender', component: Calender },

];