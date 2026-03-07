import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  master?: boolean;
  role?: 'SYSTEM_ADMIN' | 'CLIENT_ADMIN' | 'CLIENT_USER';
}

export interface SessionUser {
  nome: string;
  email: string;
  master?: boolean;
  role?: 'SYSTEM_ADMIN' | 'CLIENT_ADMIN' | 'CLIENT_USER';
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
      .post<LoginResponse>(`${this.apiUrl}/login`, payload, {
        withCredentials: true,
        headers: this.buildTenantHeaders(),
      })
      .pipe(tap((response) => this.setSession(response)));
  }

  logout(): void {
    this.http
      .post(`${this.apiUrl}/logout`, {}, {
        withCredentials: true,
        headers: this.buildTenantHeaders(),
      })
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

  isSystemAdmin(): boolean {
    return this.currentUser?.role === 'SYSTEM_ADMIN';
  }

  isClientAdmin(): boolean {
    return this.currentUser?.role === 'CLIENT_ADMIN';
  }

  isAnyAdmin(): boolean {
    return this.isSystemAdmin() || this.isClientAdmin() || !!this.currentUser?.master;
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
      .post<LoginResponse>(`${this.apiUrl}/refresh`, {}, {
        withCredentials: true,
        headers: this.buildTenantHeaders(),
      })
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
      this.setCurrentUser({
        nome: response.nome,
        email: response.email,
        master: response.master,
        role: response.role,
      });
    }
  }

  private clearSession(): void {
    this.accessToken = null;
    this.currentUser = null;
  }

  private buildTenantHeaders(): HttpHeaders | undefined {
    if (!environment.tenantKey) {
      return undefined;
    }
    return new HttpHeaders({ 'X-Tenant-Key': environment.tenantKey });
  }
}
