import { Component, OnInit } from '@angular/core';
import { CalendarDatePipe, CalendarDayViewComponent, CalendarEvent, CalendarMonthViewComponent, CalendarNextViewDirective, CalendarPreviousViewDirective, CalendarTodayDirective, CalendarView, CalendarWeekViewComponent, DateAdapter, provideCalendar } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { Appointment } from '../../Service/appointment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calender',
  imports: [CalendarPreviousViewDirective, CalendarTodayDirective, CalendarNextViewDirective,
    CalendarMonthViewComponent, CalendarWeekViewComponent, CalendarDayViewComponent, CalendarDatePipe],
  providers: [
    provideCalendar({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),],
  templateUrl: './calender.html',
  styleUrl: './calender.css',
})
export class Calender implements OnInit {
  constructor(
    private appointmentService: Appointment,
    private route: Router
  ) { }
  ngOnInit(): void {
    this.loadAppointments()
  }

  readonly CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;
  viewDate = new Date();
  events: CalendarEvent[] = [
    {
      start: new Date(),
      title: 'An event',
      color: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
      }
    },
  ];

  loadAppointments(): void {
    this.appointmentService.Calender_data()
      .subscribe({
        next: (data) => {
          this.events = data.map((app: any) => ({
            start: new Date(app.appointmentDate),
            title: app.patientName + ' - ' + app.status + ' - ' + app.priority,
            color: this.getColor(app.status)
          }));

        },
        error: (err) => {
          console.error('API error:', err);
        }
      });
  }

  setView(view: CalendarView) {
    this.view = view;
  }
  getColor(status: string) {
    switch (status) {
      case 'PENDING':
        return { primary: '#f59e0b', secondary: '#fef3c7' };
      case 'DONE':
        return { primary: '#22c55e', secondary: '#dcfce7' };
      case 'CANCELLED':
        return { primary: '#ef4444', secondary: '#fee2e2' };
      default:
        return { primary: '#3b82f6', secondary: '#dbeafe' };
    }
  }
}
