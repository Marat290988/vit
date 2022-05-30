import { Injectable } from "@angular/core";
import { 
    ActivatedRouteSnapshot, 
    CanActivate, 
    CanLoad, 
    RouterStateSnapshot, 
    Router, 
    UrlTree, 
    Route, 
    UrlSegment } from "@angular/router";
import { first, Observable, map } from "rxjs";
import { AuthenticationService } from './../services/authentication/authentication.service';
import { PopupService } from 'src/app/services/pop-up/pop-up.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

    constructor (
        private router: Router,
        private authService: AuthenticationService,
        private popupService: PopupService
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.getIsAuth();
    }

    canLoad(
        route: Route, 
        segments: UrlSegment[]
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.getIsAuth();
    }

    private getIsAuth(): Observable<boolean> {
        return this.authService.isAuth$.pipe(
            first(),
            map(isAuth => {
                if (!isAuth) {
                    this.router.navigateByUrl('');
                    this.popupService.subjectLogin.next(true);
                }
                return isAuth;
            })
        )
    }

}