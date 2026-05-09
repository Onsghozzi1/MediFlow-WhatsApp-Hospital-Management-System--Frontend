import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingHome } from './pages/landing-home/landing-home';

const routes: Routes = [
   {
   path:'',
   component: LandingHome
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPageRoutingModule { }
