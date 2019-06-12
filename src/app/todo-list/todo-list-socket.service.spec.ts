import { TestBed } from '@angular/core/testing';

import { TodoListSocketService } from './todo-list-socket.service';

describe('TodoListSocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TodoListSocketService = TestBed.get(TodoListSocketService);
    expect(service).toBeTruthy();
  });
});
