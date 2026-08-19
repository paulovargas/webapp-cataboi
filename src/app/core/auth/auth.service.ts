import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, finalize, map, of, shareReplay, tap, throwError } from 'rxjs';
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
  private readonly mockEmail = 'cataboi@cataboi.com.br';
  private readonly mockPassword = 'cataboi';
  private readonly mockSessionKey = 'cataboi.mock.session';
  private accessToken: string | null = null;
  private currentUser: SessionUser | null = null;
  private refreshInFlight$?: Observable<boolean>;

  constructor(private readonly http: HttpClient) {
    this.restoreMockSession();
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    if (environment.useMockAuth) {
      if (this.isMockLogin(payload)) {
        return of(this.startMockSession());
      }

      return throwError(() => new Error('Invalid mock credentials'));
    }

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, payload, {
        withCredentials: true,
        headers: this.buildTenantHeaders(),
      })
      .pipe(
        tap((response) => this.setSession(response)),
        catchError((error) => {
          if (this.isMockLogin(payload)) {
            return of(this.startMockSession());
          }

          return throwError(() => error);
        })
      );
  }

  logout(): void {
    if (environment.useMockAuth) {
      this.clearSession();
      return;
    }

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
    this.restoreMockSession();
    if (environment.useMockAuth || this.accessToken === this.buildMockLoginResponse().token) {
      return of(!!this.accessToken);
    }

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
    localStorage.removeItem(this.mockSessionKey);
  }

  private buildTenantHeaders(): HttpHeaders | undefined {
    if (!environment.tenantKey) {
      return undefined;
    }
    return new HttpHeaders({ 'X-Tenant-Key': environment.tenantKey });
  }

  private buildMockLoginResponse(): LoginResponse {
    return {
      token: 'mock-cataboi-demo-token',
      nome: 'Usuario Demonstracao',
      email: this.mockEmail,
      role: 'CLIENT_ADMIN',
    };
  }

  private isMockLogin(payload: LoginRequest): boolean {
    return payload.email === this.mockEmail && payload.senha === this.mockPassword;
  }

  private startMockSession(): LoginResponse {
    const response = this.buildMockLoginResponse();
    this.setSession(response);
    this.persistMockSession(response);
    return response;
  }

  private persistMockSession(response: LoginResponse): void {
    localStorage.setItem(this.mockSessionKey, JSON.stringify(response));
  }

  private restoreMockSession(): void {
    if (this.accessToken) {
      return;
    }

    const storedSession = localStorage.getItem(this.mockSessionKey);
    if (!storedSession) {
      return;
    }

    try {
      this.setSession(JSON.parse(storedSession) as LoginResponse);
    } catch {
      localStorage.removeItem(this.mockSessionKey);
    }
  }
}
