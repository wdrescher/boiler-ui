import { TestBed } from '@angular/core/testing';

import { MustBeLoggedInGuard } from './must-be-logged-in.guard';

describe('MustBeLoggedInGuard', () => {
  let guard: MustBeLoggedInGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MustBeLoggedInGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
