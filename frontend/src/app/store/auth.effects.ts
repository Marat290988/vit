import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthenticationService } from "../services/authentication/authentication.service";
import { Store } from '@ngrx/store';
import { Router } from "@angular/router";
import { login, loginSuccess, loginFailed, initAuth, extractLoginData, logoutSuccess, logout } from './auth.actions';
import { switchMap, tap, map, catchError, of, fromEvent } from "rxjs";
import { AuthData } from 'src/app/store/auth.reducer';

@Injectable()
export class AuthEffects {

    constructor(
        private actions$: Actions,
        private authService: AuthenticationService,
        private store$: Store,
        private router: Router
    ) {}

    login$ = createEffect(() => this.actions$.pipe(
        ofType(login),
        switchMap(action => {
            let login;
            let key;
            if (action.username) {
                key = 'username';
                login = action.username;
            } else {
                key = 'email';
                login = action.email;
            }
            return this.authService.login({
                [key]: login,
                password: action.password
            }).pipe(
                map(authData => loginSuccess({ authData })),
                catchError(error => {
                    return of(loginFailed({
                        serverError: error.error.message
                    }))
                    }
                )
            )
        })
    ))

    saveAuthDataToLocalStorage$ = createEffect(() => this.actions$.pipe(
        ofType(loginSuccess),
        tap(({authData}) => {
            localStorage.setItem('authData', JSON.stringify(authData));
        })
    ), {dispatch: false})

    extractLoginData$ = createEffect(() => this.actions$.pipe(
        ofType(initAuth, extractLoginData),
        map(() => {
            const authDataString = localStorage.getItem('authData');
            if (!authDataString) {
                return logoutSuccess();
            }
            const authData: AuthData = JSON.parse(authDataString);
            if ((authData.exp * 1000 - 10 * 1000 - Date.now()) < 0) {
                return logoutSuccess();
              }
            return loginSuccess({ authData });
        })
    ))

    listenStorageEffect$ = createEffect(() => this.actions$.pipe(
        ofType(initAuth),
        switchMap(() => fromEvent(window, 'storage')),
        map(() => extractLoginData())
    ))

    logout$ = createEffect(() => this.actions$.pipe(
        ofType(logout),
        map(() => {
            localStorage.removeItem('authData');
            return logoutSuccess();
        })
    ))

}