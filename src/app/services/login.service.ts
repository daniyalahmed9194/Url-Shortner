import { inject, Injectable, signal } from '@angular/core';
import { User } from '../modals/user.modal';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private httpClient = inject(HttpClient);
  private users = signal<User[]>([]);

  fetchAllUsers() {
    return this.httpClient
      .get<User[]>('http://127.0.0.1:8000/docs/user/me')
      .pipe(
        tap((user) => {
          this.users.set(user), console.log('loaded all users');
        }),
        catchError((error) => {
          console.error('message', error);
          return throwError(() => new Error(error));
        })
      );
  }
  registerUser(newUser: User) {
    return this.httpClient
      .post<User>('http://127.0.0.1:8000/docs/user/register', newUser)
      .pipe(
        tap((addedUser) => {
          this.users.update((users) => [...users, addedUser]);
        })
      );
  }
  loginUser(credentials: { email: string; passwork: string }) {
    return this.httpClient
      .post<{ access_token: string }>(
        'http://127.0.0.1:8000/docs/user/register',
        credentials
      )
      .pipe(
        tap(() => {
          console.log('access_token granted');
        }),
        catchError((error) => {
          console.error('msg', error);
          return throwError(() => new Error(error));
        })
      );
  }
}
