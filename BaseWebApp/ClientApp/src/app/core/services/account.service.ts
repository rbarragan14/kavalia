import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { decode } from './jwt-decode';

import { IProfileModel } from '@app/core';
import { DataService } from './data.service';
import { UtilityService } from './utility.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AccountService {
    constructor(
        private _utilityService: UtilityService,
        private _dataService: DataService,
        private _oAuthService: OAuthService,
        @Inject(PLATFORM_ID) private platformId: string) { }

    public get isLoggedIn(): boolean {
        return this._oAuthService.hasValidAccessToken();
    }
    public get user(): IProfileModel | undefined {
        if (isPlatformBrowser(this.platformId) && this.idToken) {
            return decode(this.idToken);
        }
        return undefined;
    }
    public logout() {
        this._dataService.post('/api/account/logout').subscribe(() => {
            this._oAuthService.logOut(true);
            this._utilityService.navigateToSignIn();
        });
    }

    public get accessToken(): string {
        return this._oAuthService.getAccessToken();
    }
    // Used to access user information
    public get idToken(): string {
        return this._oAuthService.getIdToken();
    }
}
