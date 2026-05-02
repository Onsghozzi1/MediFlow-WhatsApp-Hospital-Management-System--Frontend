import { TestBed } from '@angular/core/testing';

import { GuestGard } from './guest-gard';

describe('GuestGard', () => {
  let service: GuestGard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuestGard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
