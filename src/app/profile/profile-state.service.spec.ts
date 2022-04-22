import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL } from '../app.constants';
import { User } from '../app.interface';

import { ProfileStateService } from './profile-state.service';

describe('ProfileStateService', () => {
  let service: ProfileStateService;

  let httpClient = {
    get: (url) => of({}),
    
  }

  const fakeUser: User = {
    profile_id: 1,
    username: "test", 
    email: "test",
    first_name: "",
    last_name: "",
    is_artist: false
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        {provide: HttpClient, useValue: httpClient}
      ]
    });
    service = TestBed.inject(ProfileStateService);
  });

  //this service is used for caching the profiles of other users on the users device in a hash map

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("fetchUser", () => {
    it("should request a given user from the api", () => {
      let getSpy = spyOn(httpClient, "get").and.returnValue(of(fakeUser));
      
      service.setUser("1").subscribe();
      expect(getSpy).toHaveBeenCalledWith(`${API_URL}/v1/user/1`);
    }); 

    it("should request the api only once for the same user ID", () => {
      let getSpy = spyOn(httpClient, "get").and.returnValue(of(fakeUser));
      
      service.setUser("1").subscribe();
      expect(getSpy).toHaveBeenCalledTimes(1);
      service.setUser("1").subscribe();
      expect(getSpy).toHaveBeenCalledTimes(1);
    })

    it("should return false for users who were not found", () => {
      let getSpy = spyOn(httpClient, "get").and.returnValue(throwError(new HttpErrorResponse({})));
      
      service.setUser("1").pipe(map(
        (res) => {expect(res).toBe(false)},
        // () => expect(true).toBe(false)
      )).subscribe();
      expect(getSpy).toHaveBeenCalledTimes(1);
    });
  })
});
