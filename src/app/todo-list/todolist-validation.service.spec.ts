import { TestBed } from '@angular/core/testing';

import { TodolistValidationService } from './todolist-validation.service';

describe('TodolistValidationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TodolistValidationService = TestBed.get(TodolistValidationService);
    expect(service).toBeTruthy();
  });
});
