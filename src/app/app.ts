import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { ListUsers } from './features/users/pages/list-users/list-users';
import { CalendarPreviousViewDirective, CalendarTodayDirective, CalendarNextViewDirective, CalendarMonthViewComponent, CalendarWeekViewComponent, CalendarDayViewComponent, CalendarDatePipe, DateAdapter, provideCalendar } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule,
    MatPaginatorModule
  ],
  
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ], providers: [
    {
    provide: MatPaginatorIntl,
    useClass: MatPaginatorIntl // Tell Angular which class to instantiate
    },
    provideCalendar({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mvpApp');
}
