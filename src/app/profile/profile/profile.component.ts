import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppState } from 'src/app/app.interface';
import { AppStateService } from 'src/app/services/app-state.service';
import { UserStateService } from 'src/app/services/user-state.service';
import { ProfileStateService } from '../profile-state.service';

@Component({
  selector: 'tattoo-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isEditing = false; 
  username: string; 
  isUserProfile: boolean; 

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute, 
    private _userStateService: UserStateService, 
    private _profileStateService: ProfileStateService, 
    private _appStateService: AppStateService
  ) {
  }

  ngOnInit() {
    this._activatedRoute.data.subscribe((response) => {
      if (!!response.isEditing) {
        this.isEditing = response.isEditing; 
      }
      if (!!response.isUserProfile) {
        this.isUserProfile = response.isUserProfile;
        this.username = this._userStateService.username; 
      }
      else {
        this._activatedRoute.params.subscribe(res => {
          this.username = res['username'];
          if (this.username === this._userStateService.username) {
            this._router.navigateByUrl(AppRoutingModule.calculateRoute([AppState.PROFILE, AppState.CURRENT_USER]))
          }
          else {
            this._profileStateService.setUser(this.username).subscribe(
              res => {
                if (!res) {
                  this._error(); 
                }
              }, 
              err => {
                this._error();
              }
            )
          }
        })
      }
    })
  }

  private _error(): void {
    this._appStateService.displayErrorModal = true; 
    this._router.navigateByUrl(AppState.GALLERY); 
  }

  editEvent($event: boolean): void {
    this.isEditing = $event; 
    let routes = this.isEditing ? [AppState.PROFILE, AppState.SETTINGS, AppState.ACCOUNT_SETTINGS] : [AppState.PROFILE, AppState.CURRENT_USER]
    this._router.navigateByUrl(AppRoutingModule.calculateRoute(routes))
  }
}
