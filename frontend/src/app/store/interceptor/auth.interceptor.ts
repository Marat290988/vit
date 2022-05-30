import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EMPTY, Observable, throwError } from "rxjs";
import { first, mergeMap, catchError} from "rxjs/operators";
import { Store, select } from '@ngrx/store';
import { getAccessToken } from './../auth.selectors';
import { PopupService } from 'src/app/services/pop-up/pop-up.service';
import { ErrorComponent } from "src/app/components/pop-up/error/error.component";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    
    constructor(
        private store$: Store,
        private popupService: PopupService
    ) {}
    
    intercept(
        req: HttpRequest<unknown>, 
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        return this.store$.pipe(
            select(getAccessToken),
            first(),
            mergeMap(token => {
                const authRequest = token ? req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                }) : req;
                return next.handle(authRequest)
                .pipe(
                    catchError(err => {
                        if (err.status > 0) {
                            console.log(err);
                            return throwError(err);
                        } else if (err.status === 0) {
                            console.log(err);
                            this.showError();
                            return throwError(err);
                        } else {
                            console.log(err);
                            return throwError(err);
                        }
                    })
                )
            })
        );
    }

    showError() {
        this.popupService.errorMessage = 'Network or server error, please try again later.';
        this.popupService.showComponent(ErrorComponent)
    }

}