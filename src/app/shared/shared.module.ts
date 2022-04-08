import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton'; 
import { CarouselModule } from 'primeng/carousel';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls'

import { ClickOutsideModule } from 'ng-click-outside';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LogoComponent } from './logo/logo.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { IconMessageComponent } from './icon-message/icon-message.component'; 
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { SkeletonComponent } from './skeleton/skeleton.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LogoComponent,
    NavigationComponent,
    FileUploadComponent, 
    IconMessageComponent, 
    FormBuilderComponent, 
    SkeletonComponent, 
  ],
  imports: [
    CommonModule,
    ButtonModule, 
    VgCoreModule, 
    VgControlsModule, 
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule, 
    SkeletonModule,
    CarouselModule, 
    ClickOutsideModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    LogoComponent, 
    FileUploadComponent, 
    IconMessageComponent, 
    FormBuilderComponent, 
    SkeletonComponent
  ]
})
export class SharedModule { }
