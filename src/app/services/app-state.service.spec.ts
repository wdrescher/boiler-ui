import { TestBed } from '@angular/core/testing';

import { AppStateService } from './app-state.service';

describe('AppStateService', () => {
  let service: AppStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("toggleErrorModal", () => {
    it("should flip the error modal on every call", () => {
      expect(service.displayErrorModal).toBeFalsy();
      service.toggleErrorModal(); 
      expect(service.displayErrorModal).toBeTruthy();
      service.toggleErrorModal(); 
      expect(service.displayErrorModal).toBeFalsy();
    })
  })
});
