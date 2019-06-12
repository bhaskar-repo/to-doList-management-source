import { TestBed } from '@angular/core/testing';

import { SharedModuleService } from './shared-module.service';

describe('SharedModuleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedModuleService = TestBed.get(SharedModuleService);
    expect(service).toBeTruthy();
  });
});
