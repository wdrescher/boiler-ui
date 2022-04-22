import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private _displayErrorModal: boolean = false; 

  constructor() { }
  
  toggleErrorModal(): void {
    this._displayErrorModal = !this._displayErrorModal; 
  }

  get displayErrorModal(): boolean {
    return this._displayErrorModal;
  }

  set displayErrorModal(input: boolean) {
    this._displayErrorModal = input; 
  }
}
