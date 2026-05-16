import { TestBed } from '@angular/core/testing';

import { Consultations } from './consultations';

describe('Consultations', () => {
  let service: Consultations;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Consultations);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
