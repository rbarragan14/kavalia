import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '@app/core/services/account.service';
import { Observable } from 'rxjs';

@Injectable()
export class LoginActivate implements CanActivate {
  constructor(private authService: AccountService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {

    if (!this.authService.isLoggedIn) {
        this.router.navigate(['login']);
    }
    return true;
  }
}
