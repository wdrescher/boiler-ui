import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/app.interface';

import { AppStateService } from 'src/app/services/app-state.service';
import { SettingsService } from 'src/app/services/settings.service';
import { UserStateService } from 'src/app/services/user-state.service';

interface Count {
  count: number,
  description: string;
  isSpacer?: boolean;
}

@Component({
  selector: 'tattoo-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  @Input() edit: boolean = false;
  @Output() editEvent = new EventEmitter<boolean>();
  @Input() username: string; 

  bio: string; 
  displayUsernameModal: boolean = false; 
  isLoading: boolean = false; 
  bioEdit: boolean = false;
  formGroup: FormGroup;
  formGroupUsername: FormGroup; 
  canSetUsername: boolean; 
  counts: Count[] = [
    {
      count: 150,
      description: 'free posts'
    },
    {
      count: 400,
      description: "premium posts"
    },
    {
      count: 100,
      description: "subscribers"
    }
  ]

  @Input() isUserProfile: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    private _userStateService: UserStateService, 
    private _settingsService: SettingsService, 
    private _appStateService: AppStateService
  ) {}

  ngOnInit(): void {
    for (let i = this.counts.length - 2; i >= 0; i--) {
      this.counts.splice(i + 1, 0, { count: 0, description: '', isSpacer: true })
    }

  }

  toggleBioEdit(): void {
    this.bioEdit = !this.bioEdit;
  }

  toggleEdit(): void {
    this.edit = !this.edit;
    this.editEvent.emit(this.edit);
  }

  editUsername(): void {
    this.displayUsernameModal = true; 
  }

  setUsername(): void {
    if (this.formGroupUsername.valid) {
      let username: string = this.formGroupUsername.controls['username'].value
      let data = {
        username: username.toLowerCase()
      }
      this._settingsService.updateUser(this._userStateService.username, data).subscribe(
        (res: User) => {
          this.username = res.username;
          this._userStateService.loadUser(res); 
          this.canSetUsername = false; 
          this.displayUsernameModal = false; 
        }, 
        () => {
          this._appStateService.displayErrorModal = true; 
        }
      )
    }
  }

  setValid(input: boolean): void {
    this.canSetUsername = input; 
  }
}
