import { Component, OnInit } from '@angular/core';
import { JwksValidationHandler } from 'angular-oauth2-oidc';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '@app/auth.config';
import { DataService } from '@app/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body',
  template: `
  <ngx-ui-loader fgsSize="55" fgsType="rectangle-bounce" hasProgressBar="true"></ngx-ui-loader>
  <simple-notifications></simple-notifications>
  <router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {

  constructor(private _oauthService: OAuthService,
    private _dataService: DataService,
    private router: Router) {
    this.configureOidc();
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  private configureOidc() {
    const url = this._dataService.baseurl;
    this._oauthService.configure(authConfig(url));
    this._oauthService.setStorage(localStorage);
    this._oauthService.tokenValidationHandler = new JwksValidationHandler();
    this._oauthService.loadDiscoveryDocumentAndTryLogin();
    this._oauthService.oidc = false;
  }
}
