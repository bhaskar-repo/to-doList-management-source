import { TestBed } from '@angular/core/testing';

import { TodoListRouteGuardService } from './todo-list-route-guard.service';

describe('TodoListRouteGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TodoListRouteGuardService = TestBed.get(TodoListRouteGuardService);
    expect(service).toBeTruthy();
  });
});
