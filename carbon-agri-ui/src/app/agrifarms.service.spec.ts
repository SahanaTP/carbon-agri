import { TestBed } from '@angular/core/testing';

import { AgrifarmsService } from './agrifarms.service';

describe('AgrifarmsService', () => {
  let service: AgrifarmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgrifarmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
