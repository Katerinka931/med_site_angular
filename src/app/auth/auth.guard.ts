import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "../services/auth_service/auth.service";

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
      return false;
    } else return true;
  }
}



