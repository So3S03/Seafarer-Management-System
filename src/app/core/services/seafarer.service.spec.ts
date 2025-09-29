import { TestBed } from '@angular/core/testing';

import { SeafarerService } from './seafarer.service';

describe('SeafarerService', () => {
  let service: SeafarerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeafarerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
