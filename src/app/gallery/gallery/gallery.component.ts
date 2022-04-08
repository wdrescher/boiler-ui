import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { map, take } from 'rxjs/operators';
import { merge, Observable, Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { UserStateService } from 'src/app/services/user-state.service';
import { GalleryService } from '../gallery.service';
import { AppStateService } from 'src/app/services/app-state.service';

interface ContentTracker {
  name: string; 
  content_id: string;
}

@Component({
  selector: 'tattoo-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  isResendEmailLoading = false;
  buttonText = "Resend"
  iconText = "";

  feed: ContentTracker[] = []; 
  currentOffset = 0; 

  isLoading = true; 

  constructor(
    private userStateService: UserStateService
  ) { }

  ngOnInit(): void {
    if (this.userStateService.isLoggedIn) {
    }
  }
  
  get awaitingVerification(): boolean {
    return this.userStateService.awaitingVerification;
  }

  // resendEmail(): void {
  //   this.isResendEmailLoading = true;
  //   let email = this.cookieService.get(AWAITING_VERIFICATION_KEY);
  //   this.authService.generateToken(email)
  //     .pipe(take(1))
  //     .subscribe(
  //       () => {
  //         this.buttonText = "";
  //         this.iconText = "pi pi-check";
  //       },
  //       () => {
  //       },
  //       () => {
  //         this.isResendEmailLoading = false;
  //       }
  //     )
  // }
}
