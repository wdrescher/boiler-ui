import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { BannerComponent } from './banner/banner.component';
import { SettingsComponent } from './settings/settings.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProfileComponent, 
    BannerComponent, 
    SettingsComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    ProfileRoutingModule,
    SharedModule,
    TabMenuModule,
    ReactiveFormsModule,
    InputTextModule, 
    DialogModule
  ], 
  providers: []
})
export class ProfileModule { }
