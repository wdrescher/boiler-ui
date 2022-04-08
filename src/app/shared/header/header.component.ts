import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from 'src/app/app.interface';
import { UserStateService } from 'src/app/services/user-state.service';

@Component({
  selector: 'tattoo-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private userStateService: UserStateService, 
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  signout(): void {
    this.userStateService.signout(); 
    this.router.navigateByUrl(AppState.LOGIN); 
  }

  get displaySignout(): boolean {
    return this.userStateService.isLoggedIn || this.userStateService.awaitingVerification; 
  }
}
