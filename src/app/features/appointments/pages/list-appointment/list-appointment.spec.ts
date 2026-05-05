import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAppointment } from './list-appointment';

describe('ListAppointment', () => {
  let component: ListAppointment;
  let fixture: ComponentFixture<ListAppointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAppointment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAppointment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
