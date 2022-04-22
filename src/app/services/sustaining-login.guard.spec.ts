import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AUTH_TOKEN_KEY } from '../app.constants';

import { SustainingLoginGuard } from './sustaining-login.guard';
import { UserStateService } from './user-state.service';

function fakeRouterState(url: string): RouterStateSnapshot {
  return {
    url,
  } as RouterStateSnapshot;
}

describe('SustainingLoginGuard', () => {
  let guard: SustainingLoginGuard;

  const next = new ActivatedRouteSnapshot();

  let cookieService = {
    check: (x) => true,
    get: () => {}
  };

  let userStateService = {
    login: () => {}, 
    tempLogin: () => {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: CookieService, useValue: cookieService},
        {provide: UserStateService, useValue: userStateService}
      ]
    });
    guard = TestBed.inject(SustainingLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe("canActivate", () => {
    it("should login users with an existing cookie", () => {
      const checkSpy = spyOn(cookieService, "check").and.callFake(() => true);
      const getSpy = spyOn(cookieService, "get").and.callFake(() => "token");
      const loginSpy = spyOn(userStateService, "login").and.callThrough();

      expect(guard.canActivate(next, fakeRouterState("/"))).toBe(true);
      expect(checkSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(loginSpy).toHaveBeenCalled();
    });

    it("Shouldnt do anything for users who have no cookies", () => {
      const checkSpy = spyOn(cookieService, "check").and.returnValue(false);
      const getSpy = spyOn(cookieService, "get").and.callFake(() => "token");
      const loginSpy = spyOn(userStateService, "login").and.callThrough();

      expect(guard.canActivate(next, fakeRouterState("/"))).toBe(true);
      expect(checkSpy).toHaveBeenCalledTimes(2);
      expect(getSpy).toHaveBeenCalledTimes(0);
      expect(loginSpy).toHaveBeenCalledTimes(0);
    })

    
    it("Shouldnt do anything for users who have no cookies", () => {
      cookieService.check = (input) => input === AUTH_TOKEN_KEY ? false : true;

      const getSpy = spyOn(cookieService, "get").and.callFake(() => "token");
      const loginSpy = spyOn(userStateService, "login").and.callThrough();
      const tempSpy = spyOn(userStateService, "tempLogin").and.callThrough();


      expect(guard.canActivate(next, fakeRouterState("/"))).toBe(true);
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(loginSpy).toHaveBeenCalledTimes(0);
      expect(tempSpy).toHaveBeenCalledTimes(1);
    })
  });
});
