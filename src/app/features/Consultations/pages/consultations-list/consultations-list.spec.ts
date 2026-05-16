import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationsList } from './consultations-list';

describe('ConsultationsList', () => {
  let component: ConsultationsList;
  let fixture: ComponentFixture<ConsultationsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultationsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultationsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
