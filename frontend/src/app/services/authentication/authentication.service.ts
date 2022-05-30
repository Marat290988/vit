import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { select, Store } from '@ngrx/store';
import { filter, map, Observable } from 'rxjs';
import { AuthData } from 'src/app/store/auth.reducer';
import { getAuthData } from 'src/app/store/auth.selectors';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs';
import { logout } from 'src/app/store/auth.actions';
import { User } from './../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  host = environment.apiUrl;
  logData = {};

  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService,
    private store$: Store
  ) { }

  isAuth$ = this.store$.pipe(
    select(getAuthData),
    filter(authData => authData !== undefined),
    map(authData => !!authData)
  )

  isGuest$ = this.isAuth$.pipe(
    map(isAuth => !isAuth)
  )

  register(user: {username: string, email: string, password: string}) {
    return this.http.post<User>(`${this.host}/user/register`, user);
  }

  login(user): Observable<any> {
    return this.http.post(`${this.host}/user/login`, user, {observe: 'response'}).pipe(
      tap((res: any) => {
        let logData = {
          username: null,
          email: null,
          userId: null,
          accessToken: null,
          iat: null,
          exp: null,
          role: null,
        };
        logData.username = res.body.username;
        logData.email = res.body.email;
        logData.userId = res.body.userId;
        logData.role = res.body.role;
        logData.accessToken = res.headers.get('Jwt-Token');
        this.logData = {...logData, ...this.jwtHelperService.decodeToken(res.headers.get('Jwt-Token'))};
      }),
      map((_: any) => (
        this.logData
      ))
    )
  }

  logout() {
    this.store$.dispatch(logout());
  }

  test() {
    return this.http.get<User>(`${this.host}/user/list`);
  }
}
