import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CalendarDatePipe, CalendarDayViewComponent, CalendarEvent, CalendarMonthViewComponent, CalendarNextViewDirective, CalendarPreviousViewDirective, CalendarTodayDirective, CalendarView, CalendarWeekViewComponent, DateAdapter, provideCalendar } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { Appointment } from '../../Service/appointment';
import { Router } from '@angular/router';



import {
  startOfDay,
  addHours
} from 'date-fns';

import { Subject } from 'rxjs';

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
export class Calender implements AfterViewInit {
  constructor(private appointmentService:Appointment){}
  ngAfterViewInit(): void {
    this.loadAppointments()
  }
 CalendarView = CalendarView;

  view: CalendarView = CalendarView.Week;

  viewDate: Date = new Date();

  refresh = new Subject<void>();

  events: CalendarEvent[] = [
    {
      start: addHours(startOfDay(new Date()), 9),

      end: addHours(startOfDay(new Date()), 10),

      title: 'Meeting',

      draggable: true,

      resizable: {
        beforeStart: true,
        afterEnd: true,
      },

      color: {
        primary: '#3B82F6',
        secondary: '#DBEAFE',
      },
    },
  ];

  loadAppointments(): void {

  this.appointmentService.Calender_data()
    .subscribe({

      next: (data) => {

        this.events = data
          .filter((app: any) => app?.appointmentDate)
          .map((app: any) => {

            const startDate = new Date(app.appointmentDate);

            return {

              id: app.id,

              start: startDate,

              end: new Date(
                startDate.getTime() + 60 * 60 * 1000
              ),

              title: `${app.patientName} - ${app.status}`,

              draggable: true,

              resizable: {
                beforeStart: true,
                afterEnd: true,
              },

              color: this.getColor(app.status),

              meta: app,
            };
          });

        this.refresh.next();
      },

      error: (err) => {
        console.error('API error:', err);
      }
    });
}
getColor(status: string) {

  switch (status) {

    case 'CONFIRMED':
      return {
        primary: '#10B981',
        secondary: '#D1FAE5',
      };

    case 'PENDING':
      return {
        primary: '#F59E0B',
        secondary: '#FEF3C7',
      };

    case 'CANCELLED':
      return {
        primary: '#EF4444',
        secondary: '#FEE2E2',
      };

    default:
      return {
        primary: '#3B82F6',
        secondary: '#DBEAFE',
      };
  }
}

  setView(view: CalendarView) {
    this.view = view;
  }

  hourSegmentClicked(event: any) {

    const date = event.date;

    this.events = [
      ...this.events,

      {
        start: date,

        end: addHours(date, 1),

        title: 'New Event',

        draggable: true,

        resizable: {
          beforeStart: true,
          afterEnd: true,
        },

        color: {
          primary: '#10B981',
          secondary: '#D1FAE5',
        },
      },
    ];

    this.refresh.next();
  }
eventTimesChanged({
  event,
  newStart,
  newEnd,
}: any): void {

  // 1. Update UI instantly (optimistic update)
  this.events = this.events.map((iEvent) => {

    if (iEvent === event) {

      return {
        ...event,
        start: newStart,
        end: newEnd,
      };
    }

    return iEvent;
  });

  this.refresh.next();

  // 2. Call backend API
  const appointmentId = event.id;

  const payload = {
    appointmentDate: newStart,
    endDate: newEnd,
  };

  this.appointmentService
    .moveAppointment(appointmentId, payload)
    .subscribe({

      next: (res) => {
        console.log('Moved successfully', res);
      },

      error: (err) => {
        console.error('Move failed', err);

        // OPTIONAL: rollback UI if error
        this.loadAppointments();
      }
    });
}

  handleEvent(event: CalendarEvent) {

    console.log('Event clicked', event);
  }
}
