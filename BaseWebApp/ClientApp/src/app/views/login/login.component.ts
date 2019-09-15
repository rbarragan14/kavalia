import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';

import { ILogin, IUser } from '@app/core';
import { UtilityService } from '@app/core/services/utility.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private _formBuilder: FormBuilder,
    private _oAuthService: OAuthService,
    public us: UtilityService) { }

  public login({ value, valid }: { value: ILogin, valid: boolean }): void {

    this._oAuthService.fetchTokenUsingPasswordFlow(value.username, value.password)
        .then((x: any) => {
            localStorage.setItem('id_token', x.id_token);
            this._oAuthService.setupAutomaticSilentRefresh();
            this._oAuthService.loadUserProfile().then((u: IUser) => localStorage.setItem('userId', u.identification));
            this.us.navigate('');
        });
      }

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }
}
