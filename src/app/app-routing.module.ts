import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppState } from './app.interface';
import { GalleryComponent } from './gallery/gallery/gallery.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandingPageState } from './landing-page/landing-page.interface';
import { SustainingLoginGuard } from './services/sustaining-login.guard';
import { MustBeLoggedInGuard } from './services/must-be-logged-in.guard';
import { HomeGuard} from './services/home.guard';
import { UserGuard } from './services/user.guard'; 

const routes: Routes = [
  {
    path: "", canActivate: [SustainingLoginGuard], children: [
      { path: AppState.LOGIN, canActivate: [HomeGuard], component: LandingPageComponent },
      { path: AppState.SIGNUP, component: LandingPageComponent, data: { pageState: LandingPageState.SIGNUP } },
      { path: AppState.FORGOT_PASSWORD, component: LandingPageComponent, data: { pageState: LandingPageState.FORGOT_PASSWORD } },
      { path: `${AppState.RESET_PASSWORD}/:token`, component: LandingPageComponent, data: { pageState: LandingPageState.RESET_PASSWORD } },
      { path: AppState.SET_PASSWORD, component: LandingPageComponent, data: { pageState: LandingPageState.SET_PASSWORD } },
      { path: `${AppState.EMAIL_VERIFICATION}/:token`, component: LandingPageComponent, data: { pageState: LandingPageState.EMAIL_VERIFICATION } },
      {
        path: "", canActivate: [MustBeLoggedInGuard, UserGuard], children: [
          { path: AppState.GALLERY, component: GalleryComponent },
          { path: AppState.PROFILE, loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)}, 
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    { scrollPositionRestoration: 'enabled' }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule {
  public static calculateRoute(routes: string[]): string {
    return routes.reduce((a, b) => `${a}/${b}`);
  }
}
 