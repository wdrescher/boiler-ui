import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserStateService } from 'src/app/services/user-state.service';
import { AppState } from 'src/app/app.interface';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppStateService } from 'src/app/services/app-state.service';

interface NavigationTab {
  name: string;
  route: string;
  class: string;
  isUpload?: () => boolean;
}

@Component({
  selector: 'tattoo-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  tabs: NavigationTab[] = [
    {
      name: 'Home',
      route: AppState.GALLERY,
      class: 'pi pi-home'
    },
    {
      name: 'New',
      route: AppState.SETUP,
      class: 'pi pi-plus-circle',
    },
    {
      name: 'Discover',
      route: AppState.GALLERY,
      class: 'pi pi-th-large'
    },
    {
      name: 'Profile',
      route: AppRoutingModule.calculateRoute([AppState.PROFILE, AppState.CURRENT_USER]),
      class: 'pi pi-user'
    }
  ];

  postInProgress: boolean = false; 

  constructor(
    private _router: Router,
    private _userStateService: UserStateService, 
    private _appStateService: AppStateService
  ) { }

  ngOnInit(): void {
    this._userStateService.$postInProgress.subscribe((inProgress) => {
      this.postInProgress = inProgress; 
    })
  }

  get isLoggedIn(): boolean {
    return this._userStateService.isLoggedIn;
  }

  navigate(tab: NavigationTab): void {
    this._router.navigateByUrl(tab.route);
  }
}
 