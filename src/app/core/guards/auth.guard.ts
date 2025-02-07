import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// Auth Services

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(): boolean {
      if (sessionStorage.getItem('login') === null) {
        this.router.navigate(['auth/login']);
        return false;
      }
      return true;
    }
}
