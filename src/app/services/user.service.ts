import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/User';
import { catchError, Observable } from 'rxjs';
import { Users } from '../interfaces/Users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private errorService: ErrorService) {}

  public getUsers(queryParams: {
    page: number;
    limit: number;
  }): Observable<Users> {
    return this.http
      .get<Users>(
        environment.api +
          `/users?limit=${queryParams.limit}&page=${queryParams.page}`
      )
      .pipe(
        catchError(
          this.errorService.handleErrors<any>('User retrieve failed', {})
        )
      );
  }

  public createUsers(user: User): Observable<User> {
    return this.http
      .post<User>(environment.api + '/users', user)
      .pipe(
        catchError(
          this.errorService.handleErrors<any>('User creation failed', {})
        )
      );
  }

  public updateUser(data: { user: User; id: string }): Observable<User> {
    const { user, id } = data;
    return this.http
      .patch<User>(environment.api + `/users/${id}`, user)
      .pipe(
        catchError(
          this.errorService.handleErrors<any>('User creation failed', {})
        )
      );
  }

  public getUser(id: string): Observable<User> {
    return this.http
      .get<User>(environment.api + `/users/${id}`)
      .pipe(
        catchError(
          this.errorService.handleErrors<any>('Failed to retrieve user', {})
        )
      );
  }

  public searchUser(name: string): Observable<User[]> {
    return this.http
      .get<User[]>(environment.api + '/users')
      .pipe(
        catchError(
          this.errorService.handleErrors<any>('User retrieve failed', {})
        )
      );
  }

  public deleteUser(user_id: string): Observable<any> {
    return this.http
      .delete<Observable<any>>(environment.api + `/users/${user_id}`)
      .pipe(
        catchError(
          this.errorService.handleErrors<any>('User retrieve failed', false)
        )
      );
  }
}
