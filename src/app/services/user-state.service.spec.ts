import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { AUTH_TOKEN_KEY } from '../app.constants';
import { User } from '../app.interface';

import { UserStateService } from './user-state.service';

describe('UserStateService', () => {
  let service: UserStateService;

  let cookieService = {
    deleteAll: () => {},
    set: (x, y, z, h) => {}
  };

  const fakeUser: User = {
    profile_id: 1,
    username: "test", 
    email: "test",
    first_name: "",
    last_name: "",
    is_artist: false
  }

  let deleteSpy;

  beforeEach(() => {
    deleteSpy = spyOn(cookieService, "deleteAll").and.callThrough();
    TestBed.configureTestingModule({
      providers: [
        { provide: CookieService, useValue: cookieService}
      ]
    });
    service = TestBed.inject(UserStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("signout", () => {
    it("should delete the tokens", () => {

      service.signout();
      expect(service.isDefined).toBe(false);
      expect(service.isLoggedIn).toBe(false);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
    })
  });

  describe("login", () => {
    it("should log user in and set data", () => {
      const setSpy = spyOn(cookieService, "set").and.callThrough();
      
      service.login("token");
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(setSpy).toHaveBeenCalledWith(AUTH_TOKEN_KEY, "token", undefined, "/");
      expect(service.isLoggedIn).toBe(true);
    })
  });

  describe("tempLogin", () => {
    it("should templogin", () => {
      const setSpy = spyOn(cookieService, "set").and.callThrough();
      
      service.tempLogin("token");
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(setSpy).toHaveBeenCalled();
      expect(service.isLoggedIn).toBe(false);
      expect(service.awaitingVerification).toBe(true);
    })
  });

  describe("loadUser", () => {
    it("should load user", () => {
      service.loadUser(fakeUser);
      expect(service.username).toBe(fakeUser.username);
      expect(service.isDefined).toBe(true);
      expect(service.firstName).toBe(fakeUser.first_name);
      expect(service.lastName).toBe(fakeUser.last_name);
      expect(service.email).toBe(fakeUser.email);
      expect(service.profileId).toBe(fakeUser.profile_id);
      expect(service.isArtist).toBe(fakeUser.is_artist);
    })
  });
});
