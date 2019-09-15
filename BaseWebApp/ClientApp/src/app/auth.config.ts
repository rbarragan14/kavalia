import { AuthConfig } from 'angular-oauth2-oidc';

export function authConfig(url: string): AuthConfig {

    return {
        // Url of the Identity Provider
        issuer: url + '/',

        // URL of the SPA to redirect the user to after login
        redirectUri: url,

        // The SPA's id. The SPA is registered with this id at the auth-server
        clientId: 'basewebapp',
        dummyClientSecret: '388D45FA-B36B-4988-BA59-B187D329C207',
        tokenEndpoint: url + '/connect/token',
        requireHttps: false,

        // set the scope for the permissions the client should request
        // The first three are defined by OIDC.
        scope: 'openid profile email'
    };

}
