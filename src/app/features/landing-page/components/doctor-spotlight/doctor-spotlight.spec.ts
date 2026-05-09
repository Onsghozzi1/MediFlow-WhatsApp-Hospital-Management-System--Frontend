import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorSpotlight } from './doctor-spotlight';

describe('DoctorSpotlight', () => {
  let component: DoctorSpotlight;
  let fixture: ComponentFixture<DoctorSpotlight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorSpotlight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorSpotlight);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
