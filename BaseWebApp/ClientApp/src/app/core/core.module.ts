import { NgModule, Optional, SkipSelf, ModuleWithProviders, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';

// App level services
import { AccountService } from './services/account.service';
import { DataService } from './services/data.service';
import { UtilityService } from './services/utility.service';
import { AuthInterceptor, TimingInterceptor } from './services/interceptors';
import { GlobalErrorHandler } from './services/global-error.service';
import { OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { CatalogService, CalculationService } from '@app/core/services/models';
import { HierarchyService } from '@app/core/services/models/hierarchy.service';
import { CompensationService } from '@app/core/services/models/compensation.service';
import { IndicatorService } from '@app/core/services/models/indicator.service';
import { DataSourceService } from '@app/core/services/models/datasource.service';

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        // NgbModule.forRoot(),
        RouterModule,
        OAuthModule.forRoot(),
        // TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: ApiTranslationLoader } }),
    ],
    exports: [
        RouterModule,
    ],
    providers: []
})
export class CoreModule {
    // forRoot allows to override providers
    // https://angular.io/docs/ts/latest/guide/ngmodule.html#!#core-for-root
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                AccountService,
                DataService,
                UtilityService,
                OAuthService,
                UrlHelperService,
                AppNotificationsService,
                CatalogService,
                HierarchyService,
                IndicatorService,
                CompensationService,
                CalculationService,
                DataSourceService,
                { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
                { provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true },
                { provide: ErrorHandler, useClass: GlobalErrorHandler },
            ]
        };
    }
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
