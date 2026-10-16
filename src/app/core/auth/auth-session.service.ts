import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../../features/auth/models/user.model';

interface Credentials {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly http = inject(HttpClient);
  private readonly credentialsState = signal<Credentials | null>(null);
  private readonly userState = signal<User | null>(null);

  readonly isAuthenticated = computed(() => this.credentialsState() !== null);
  readonly currentUser = this.userState.asReadonly();

  login(email: string, password: string): Observable<User> {
    const authorization = createBasicAuthorization(email, password);
    const headers = new HttpHeaders({ Authorization: authorization });

    return this.http
      .post<User>('/auth/login', null, { headers })
      .pipe(
        tap((user) => {
          this.credentialsState.set({ email, password });
          this.userState.set(user);
        }),
      );
  }

  authorizationHeader(): string | null {
    const credentials = this.credentialsState();
    return credentials
      ? createBasicAuthorization(credentials.email, credentials.password)
      : null;
  }

  logout(): void {
    this.credentialsState.set(null);
    this.userState.set(null);
  }
}

function createBasicAuthorization(email: string, password: string): string {
  const bytes = new TextEncoder().encode(`${email}:${password}`);
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return `Basic ${btoa(binary)}`;
}