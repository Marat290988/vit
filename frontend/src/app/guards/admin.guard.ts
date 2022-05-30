import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user/user.service';
import { Router } from '@angular/router';

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(
        private userService: UserService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        return this.isAdmin();
    }

    isAdmin(): boolean {
        if (this.userService.user.role === 'ROLE_ADMIN') {
            return true;
        } else {
            this.router.navigateByUrl('');
            return false;
        }
    }

}