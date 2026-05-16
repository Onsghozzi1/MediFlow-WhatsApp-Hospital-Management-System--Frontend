import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationShell } from './consultation-shell';

describe('ConsultationShell', () => {
  let component: ConsultationShell;
  let fixture: ComponentFixture<ConsultationShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultationShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultationShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
