import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { FeedResponse } from './gallery.interface';
import { API_URL } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor(
    private _http: HttpClient
  ) {}

  galleryFeed(username: string, offset?: number, limit?: number): Observable<FeedResponse | HttpErrorResponse> {
    return this._http.get(`${API_URL}/v1/user/${username}/feed?offset=${offset}&limit=${limit}`).pipe(map(
      (res: FeedResponse) => res, 
      (err: HttpErrorResponse) => err
    ))
  }
}
