import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { MenuItem, Message, MessageService } from 'primeng/api';

import { LandingPageComponent } from 'src/app/landing-page/landing-page.component';
import { UserStateService } from 'src/app/services/user-state.service';
import { UpdateUserRequest } from 'src/app/services/settings.interface';
import { SettingsService } from 'src/app/services/settings.service';
import { SettingsState } from '../settings-state';
import { AppStateService } from 'src/app/services/app-state.service';
import { AppState, SettingItem, User } from 'src/app/app.interface';
import { COUNTRIES } from 'src/app/app.constants';
import { AppRoutingModule } from 'src/app/app-routing.module';

interface PageConfig {
  formGroup: FormGroup,
  settings: SettingItem[]
}

@Component({
  selector: 'tattoo-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  formGroup: FormGroup;
  private _pageState: SettingsState = SettingsState.AccountSettings;
  isLoading: boolean = false;

  settingMap: { [label: string]: PageConfig } = {};

  items: MenuItem[] = [
    { label: SettingsState.AccountSettings, icon: 'pi pi-user', routerLink: this._navigate(AppState.ACCOUNT_SETTINGS), routerLinkActiveOptions: {exact: true} },
    { label: SettingsState.Password, icon: 'pi pi-lock', routerLink: this._navigate(AppState.PASSWORD_SETTINGS) },
    // { label: SettingsState.Billing, icon: 'pi pi-credit-card', routerLink: this._navigate(AppState.BILLING_SETTINGS) },
    { label: SettingsState.Address, icon: 'pi pi-home', routerLink: this._navigate(AppState.ADDRESS_SETTINGS) }
  ]

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _userStateService: UserStateService,
    private _formBuilder: FormBuilder,
    private _settingsService: SettingsService,
    private _appStateService: AppStateService, 
    private _messageService: MessageService
  ) { }

  private _navigate(state: AppState): string[] {
    return ["/" + AppRoutingModule.calculateRoute([AppState.PROFILE, AppState.SETTINGS, state])];
  }

  ngOnInit(): void {
    let accountSettings: SettingItem[] = [
      {
        label: "Email", 
        previousValue: this._userStateService.email, 
        formControlName: "email", 
        validators: [], 
        type: "text", 
        errorCode: "Please enter a valid email", 
        readOnly: true
      },
      {
        label: "First Name *",
        previousValue: this._userStateService.firstName,
        formControlName: "first_name",
        validators: [Validators.required],
        type: 'text',
        errorCode: "Please enter a first name",
      },
      {
        label: "Last Name *",
        previousValue: this._userStateService.lastName,
        formControlName: "last_name",
        validators: [Validators.required],
        type: 'text',
        errorCode: "Please enter a last",
      },
    ];

    let securitySettings: SettingItem[] = [
      {
        label: "Password",
        previousValue: "",
        formControlName: 'password',
        validators: [],
        type: 'password',
        errorCode: "",
      },
      {
        label: "Confirm Password",
        previousValue: "",
        formControlName: 'confirm_password',
        validators: [LandingPageComponent.matchValues("password")],
        type: 'password',
        errorCode: "Make sure your passwords match",
        hideField: true
      },
    ]

    // let addressSettings: SettingItem[] = [
    //   {
    //     label: "Address",
    //     previousValue: this._userStateService.addressLine1,
    //     formControlName: "street_address",
    //     validators: [Validators.required],
    //     type: 'text',
    //     errorCode: "Please enter a street address",
    //   },
    //   {
    //     label: "Address: Line 2",
    //     previousValue: this._userStateService.addressLine2,
    //     formControlName: 'street_address_line_2',
    //     validators: [],
    //     type: 'text',
    //     errorCode: "Please enter address line 2"
    //   },
    //   {
    //     label: "City",
    //     previousValue: this._userStateService.city,
    //     formControlName: 'city',
    //     validators: [Validators.required],
    //     type: 'text',
    //     errorCode: "Please enter a valid city"
    //   },
    //   {
    //     label: "State or Province",
    //     previousValue: this._userStateService.stateOrProvince,
    //     formControlName: 'state_or_province',
    //     validators: [Validators.required],
    //     type: 'text',
    //     errorCode: "Please enter a valid state or province"
    //   },
    //   {
    //     label: "Country",
    //     options: COUNTRIES,
    //     previousValue: COUNTRIES.find( elem => elem.code === (!!this._userStateService.country ? this._userStateService.country : 'US')),
    //     formControlName: 'country',
    //     validators: [Validators.required],
    //     type: 'select',
    //     errorCode: "Please enter a valid country",
    //     isCountry: true
    //   }
    // ]

    this.settingMap = {
      "Account": {
        formGroup: this.createFormGroup(accountSettings),
        settings: accountSettings
      },
      "Password": {
        formGroup: this.createFormGroup(securitySettings),
        settings: securitySettings
      },
      // 'Address': {
      //   formGroup: this.createFormGroup(addressSettings),
      //   settings: addressSettings
      // }
    }

    this._activatedRoute.data.subscribe((response) => {
      if (!!response.pageState) {
        this.pageState = response.pageState;
      }
    })
  }

  submit(): void {
    if (this.isLoading) {
      return;
    }
    if (this.pageState === SettingsState.Password) {

    }
    else { //pages correlated to update user endpoint
      this.isLoading = true;
      if (this.settingConfig.formGroup.valid) {
        let data = this.createUpdateBody();
        this._settingsService.updateUser(this._userStateService.username, data)
          .pipe(take(1))
          .subscribe(
            (response: User) => {
              let message: Message = {
                closable: true, 
                severity: "success", 
                data: "Account updated"
              }
              this._messageService.add(message)
              this.setNewValues(response);
              this.isLoading = false;
            },
            () => {
              this._error();
            }
          );
      }
    }
  }

  get activeItem(): MenuItem {
    return this.items.find(elem => elem.label === this.pageState)
  }

  get settingConfig(): PageConfig {
    return this.settingMap[this.pageState]
  }

  get hasChanges(): boolean {
    for (let item of this.settingConfig.settings) {
      let control = this.settingConfig.formGroup.controls[item.formControlName];
      if (control.touched && control.value != item.previousValue) {
        return true;
      }
    }
    return false;
  }

  get isDisabled(): boolean {
    return !this.settingConfig.formGroup.valid || !this.hasChanges;
  }

  get pageState(): SettingsState {
    return this._pageState; 
  }

  set pageState(input: SettingsState) {
    this._pageState = input; 
  }

  reset(): void {
    this.settingConfig.settings.forEach(setting => {
      this.settingConfig.formGroup.controls[setting.formControlName].setValue(setting.previousValue);
    })
  }

  createFormGroup(settings: SettingItem[]): FormGroup {
    let options = []
    for (let setting of settings) {
      options[setting.formControlName] = [
        setting.previousValue, setting.validators
      ]
    }
    return this._formBuilder.group(options);
  }

  createUpdateBody(): UpdateUserRequest {
    let output: UpdateUserRequest = {}
    this.settingConfig.settings.forEach(setting => {
      let control = this.settingConfig.formGroup.controls[setting.formControlName];
      if (control.value != setting.previousValue) {
        if (setting.httpField) {
          output[setting.formControlName] = this.padWithHttp(setting.formControlName);
        }
        else if (setting.isCountry) {
          output[setting.formControlName] = control.value.code;
        }
        else {
          output[setting.formControlName] = control.value
        }
      }
    })
    return output;
  }

  padWithHttp(controlName: string): string {
    let value = this.settingConfig.formGroup.controls[controlName].value;
    if (value.indexOf('http') < 0) {
      value = `http://${value}`;
    }
    return value;
  }

  private setNewValues(response): void {
    this._userStateService.loadUser(response);
    this.settingConfig.settings.forEach(elem => {
      if (!!elem.options) {
        let value = response[elem.formControlName]; 
        elem.previousValue = elem.options.find(index => index.code === value);
      }
      else {
        elem.previousValue = response[elem.formControlName];
      }
    })
  }

  private _error(): void {
    this._appStateService.displayErrorModal = true;
    this.isLoading = false;
  }

  undefinedMessage(input: string | undefined, message: string): string {
    return !!input ? input : message;
  }
  
  linkRegex(host: string) {
    return new RegExp(`^((https*:\/\/)?(www\.)?${host}\.com/(.?))`)
  }
}
