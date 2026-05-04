import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { ListUsers } from './features/users/pages/list-users/list-users';

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
    }
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mvpApp');
}
