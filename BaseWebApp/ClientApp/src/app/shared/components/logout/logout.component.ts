import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private _accountService: AccountService) { }

  ngOnInit() {
    this._accountService.logout();
  }
}
