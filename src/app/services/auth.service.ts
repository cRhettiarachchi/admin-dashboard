import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { User } from '../interfaces/User';
import { LoginData, TokenData } from '../interfaces/LoginData';
import * as moment from 'moment';
import { userRoles } from '../config/userRoles';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //public
  public currentUser: Observable<User | null>;

  //private
  private currentUserSubject: BehaviorSubject<User | null>;

  constructor(private http: HttpClient, private errorService: ErrorService) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(<string>localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return (
      this.currentUser &&
      this.currentUserSubject.value?.role === userRoles.admin
    );
  }

  /**
   *  Confirms if user is client
   */
  get isUser() {
    return (
      this.currentUser && this.currentUserSubject.value?.role === userRoles.user
    );
  }

  login(user: {
    email: string;
    password: string;
  }): Observable<LoginData | boolean> {
    return this.http
      .post<LoginData>(environment.api + '/auth/login', user)
      .pipe(
        tap((res) => {
          if (res && res.user && res.tokens) {
            this.setSession(res);
            this.currentUserSubject.next(res.user);
          }
        }),
        catchError(
          this.errorService.handleErrors<false>('User login failed', false)
        )
      );
  }

  setSession(authResult: LoginData) {
    const expiresAt = moment().add(
      authResult.tokens?.access?.expires,
      'second'
    );

    localStorage.setItem(
      'id_token',
      authResult.tokens ? authResult.tokens.access?.token : ''
    );
    this.saveRefreshToken(
      authResult.tokens ? authResult.tokens.refresh?.token : ''
    );
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));

    if (authResult.user) {
      localStorage.setItem('currentUser', JSON.stringify(authResult.user));
    }
  }

  updateSession(tokens: TokenData) {
    const expiresAt = moment().add(tokens.access.expires, 'second');

    localStorage.setItem('id_token', tokens.access ? tokens.access.token : '');

    this.saveRefreshToken(tokens.refresh ? tokens.refresh?.token : '');

    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  public saveRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token);
  }

  public getRefreshToken(): string | any {
    return localStorage.getItem('refresh_token');
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('refresh_token');

    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // notify
    this.currentUserSubject.next(null);
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = expiration ? JSON.parse(expiration) : null;
    return moment(expiresAt);
  }

  refreshToken(token: string) {
    return this.http.post(environment.api + '/auth/refresh-tokens', {
      refreshToken: token,
    });
  }
}
