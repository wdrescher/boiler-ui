import { Component, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';

import { AppStateService } from './services/app-state.service'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], 
  providers: [ MessageService ] 
})
export class AppComponent implements OnInit{
  title = 'peek';
  isLoading = false;

  constructor(
    private router: Router, 
    private primeNgConfig: PrimeNGConfig, 
    private appStateService: AppStateService, 
    private mes: MessageService
  ) {}

  ngOnInit(): void {
    this.mes.add({severity: "success", data: "it works"})
    this.primeNgConfig.ripple = true;
    this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.isLoading = true;
          window.scrollTo({top: 0});
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.isLoading = false;
          break;
        }
        default: {
          break;
        }
      }
    })
  }

  get displayErrorModal(): boolean {
    return this.appStateService.displayErrorModal; 
  }

  set displayErrorModal(input: boolean) {
    this.appStateService.displayErrorModal = input; 
  }
}
