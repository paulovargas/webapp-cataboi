import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, finalize, map, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface LoginRequest {
  email: string;
  senha: string;
}

interface LoginResponse {
  token: string;
  nome?: string;
  email?: string;
}

interface SessionUser {
  nome: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private accessToken: string | null = null;
  private currentUser: SessionUser | null = null;
  private refreshInFlight$?: Observable<boolean>;

  constructor(private readonly http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, payload, { withCredentials: true })
      .pipe(tap((response) => this.setSession(response)));
  }

  logout(): void {
    this.http
      .post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(catchError(() => of(null)))
      .subscribe({
        next: () => this.clearSession(),
        error: () => this.clearSession(),
      });
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return this.accessToken;
  }

  getCurrentUser(): SessionUser | null {
    return this.currentUser;
  }

  setCurrentUser(user: SessionUser): void {
    this.currentUser = user;
  }

  ensureSession(): Observable<boolean> {
    if (this.accessToken) {
      return of(true);
    }

    return this.refreshSession();
  }

  refreshSession(): Observable<boolean> {
    if (this.refreshInFlight$) {
      return this.refreshInFlight$;
    }

    const request$ = this.http
      .post<LoginResponse>(`${this.apiUrl}/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((response) => this.setSession(response)),
        map(() => true),
        catchError(() => {
          this.clearSession();
          return of(false);
        }),
        finalize(() => {
          this.refreshInFlight$ = undefined;
        }),
        shareReplay(1)
      );

    this.refreshInFlight$ = request$;
    return request$;
  }

  private setSession(response: LoginResponse): void {
    this.accessToken = response.token;
    if (response.nome && response.email) {
      this.setCurrentUser({ nome: response.nome, email: response.email });
    }
  }

  private clearSession(): void {
    this.accessToken = null;
    this.currentUser = null;
  }
}
