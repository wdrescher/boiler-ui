import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthService } from './auth.service';
import { UserStateService } from './user-state.service';
import { UserGuard } from './user.guard';
import { AppStateService } from './app-state.service';
import { HttpClient, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { User } from '../app.interface';
import { Observable, of, pipe, Subject, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

function fakeRouterState(url: string): RouterStateSnapshot {
  return {
    url,
  } as RouterStateSnapshot;
}

describe('UserGuard', () => {
  let guard: UserGuard;

  const fakeUser: User = {
    profile_id: 1,
    username: "test", 
    email: "test",
    first_name: "",
    last_name: "",
    is_artist: false
  }

  let userService: {
    isLoggedIn: boolean, 
    isDefined: boolean, 
    loadUser: () => {},
    signout: () => {},
  };
  let appStateService = {
    toggleErrorModal: jasmine.createSpy("toggleErrorModal").and.callThrough()
  }

  const loadUser = jasmine.createSpy("loadUser");

  let authService = {
    loadUser: loadUser
  }

  const next = new ActivatedRouteSnapshot();


  beforeEach(() => {
    userService = {
      isLoggedIn: false,
      isDefined: false,
      loadUser: jasmine.createSpy("loadUser").and.callThrough(),
      signout: jasmine.createSpy("signout").and.callThrough()
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: UserStateService, useValue: userService },
        { provide: AppStateService, useValue: appStateService },
        { provide: AuthService, useValue: authService }, 
      ]
    });
    guard = TestBed.inject(UserGuard);
  });

  it('should be created', () => { 
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should signout users who fail to login', () => {
      guard = TestBed.inject(UserGuard);
      userService.isLoggedIn = true; 
      userService.isDefined = false;

      loadUser.and.returnValue(throwError(HttpErrorResponse));
      let res = guard.canActivate(next, fakeRouterState('/')) as Observable<UrlTree>;
      res.subscribe(() => {
        expect(appStateService.toggleErrorModal).toHaveBeenCalled();
        expect(userService.signout).toHaveBeenCalled();
      })
    });

    it('should load users who have a cookie but who have not fetched profile', () => {
      guard = TestBed.inject(UserGuard);
      userService.isLoggedIn = true; 
      userService.isDefined = false;

    
      loadUser.and.returnValue(of(fakeUser));
      let s = guard.canActivate(next, fakeRouterState('/')) as Observable<boolean>;
      s.subscribe((result: boolean) => {
        expect(result).toBe(true)
        expect(loadUser).toHaveBeenCalled();
        expect(userService.loadUser).toHaveBeenCalled();
      });
    });

    it('should not change users who have already fetched data', () => {
      userService.isDefined = true;
      userService.isLoggedIn = true;
      expect(guard.canActivate(next, fakeRouterState('/'))).toBe(true);
    });
  })
});
