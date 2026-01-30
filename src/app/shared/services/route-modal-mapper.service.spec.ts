import { TestBed } from '@angular/core/testing';

import { RouteModalMapperService } from './route-modal-mapper.service';

describe('RouteModalMapperService', () => {
  let service: RouteModalMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteModalMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
