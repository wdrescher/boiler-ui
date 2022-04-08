import { TestBed } from '@angular/core/testing';

import { SustainingLoginGuard } from './sustaining-login.guard';

describe('SustainingLoginGuard', () => {
  let guard: SustainingLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SustainingLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
