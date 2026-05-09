import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Hero } from '../../components/hero/hero';
import { Services } from '../../components/services/services';
import { Footer } from '../../components/footer/footer';
import { CommonModule } from '@angular/common';
import { AppointmentCard } from '../../components/appointment-card/appointment-card';
import { DoctorSpotlight } from '../../components/doctor-spotlight/doctor-spotlight';
import { CtaBanner } from '../../components/cta-banner/cta-banner';

@Component({
  selector: 'app-landing-home',
  imports: [Navbar,Hero,Services,Footer,CommonModule,AppointmentCard,DoctorSpotlight,CtaBanner],
  templateUrl: './landing-home.html',
  styleUrl: './landing-home.css',
})
export class LandingHome {

}
