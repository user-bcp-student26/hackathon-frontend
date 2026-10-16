import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterRequest } from './models/register-request.model';
import { User } from './models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  register(request: RegisterRequest): Observable<User> {
    return this.http.post<User>('/users', request);
  }
}