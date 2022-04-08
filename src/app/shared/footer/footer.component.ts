import { Component, OnInit } from '@angular/core';
import { UserStateService } from 'src/app/services/user-state.service';

@Component({
  selector: 'tattoo-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    private _userStateService: UserStateService
  ) { }

  ngOnInit(): void {
  }

  get isLoggedIn(): boolean {
    return this._userStateService.isLoggedIn;
  }
}
