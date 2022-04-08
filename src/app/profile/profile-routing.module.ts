import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppState } from '../app.interface';
import { UserGuard } from '../services/user.guard';
import { ProfileComponent } from './profile/profile.component';
import { SettingsState } from './settings-state';

const routes: Routes = [
  { path: '', children: [
    { path: AppState.CURRENT_USER, component: ProfileComponent, data: { isUserProfile: true } },
    { path: ":username", component: ProfileComponent },
    {
      path: AppState.SETTINGS, children: [
        { path: AppState.ACCOUNT_SETTINGS, component: ProfileComponent, data: { isUserProfile: true, isEditing: true, pageState: SettingsState.AccountSettings } }, 
        { path: AppState.PASSWORD_SETTINGS, component: ProfileComponent, data: { isUserProfile: true, isEditing: true, pageState: SettingsState.Password } }, 
        { path: AppState.BILLING_SETTINGS, component: ProfileComponent, data: { isUserProfile: true, isEditing: true, pageState: SettingsState.Billing } }, 
        { path: AppState.ADDRESS_SETTINGS, component: ProfileComponent, data: { isUserProfile: true, isEditing: true, pageState: SettingsState.Address } }
      ]
    }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
