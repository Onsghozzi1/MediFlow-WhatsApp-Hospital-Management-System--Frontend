import { TestBed } from '@angular/core/testing';

import { Landingpage } from './landingpage';

describe('Landingpage', () => {
  let service: Landingpage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Landingpage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
