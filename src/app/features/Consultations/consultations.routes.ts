import { Routes } from '@angular/router';
import { ConsultationsList } from './pages/consultations-list/consultations-list';
import { ConsultationShell } from './pages/consultation-shell/consultation-shell';
import { ConsultationDetails } from './pages/consultation-details/consultation-details';

export const Consultation_ROUTES: Routes = [
  {
    path: 'list',
    component: ConsultationsList
  }
  , {
    path: 'consultation-shell',
    component: ConsultationShell
  }, {
    path: 'consultation-details/:id',
    component: ConsultationDetails
  }
];