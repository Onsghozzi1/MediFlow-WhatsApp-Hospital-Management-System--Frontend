import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConsultationsList } from './add-consultations-list';

describe('AddConsultationsList', () => {
  let component: AddConsultationsList;
  let fixture: ComponentFixture<AddConsultationsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddConsultationsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddConsultationsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
