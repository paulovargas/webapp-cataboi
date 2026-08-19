import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let originalUseMockAuth: boolean;

  beforeEach(() => {
    originalUseMockAuth = environment.useMockAuth;
    environment.useMockAuth = false;
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    environment.useMockAuth = originalUseMockAuth;
    localStorage.clear();
  });

  it('should create a session when API login succeeds', () => {
    service.login({ email: 'user@test.com', senha: 'secret' }).subscribe();

    const request = httpMock.expectOne('http://localhost:8080/auth/login');
    request.flush({
      token: 'api-token',
      nome: 'Usuario API',
      email: 'user@test.com',
      role: 'CLIENT_USER',
    });

    expect(service.getToken()).toBe('api-token');
    expect(service.getCurrentUser()?.email).toBe('user@test.com');
  });

  it('should create a mock session when API login fails and demo credentials are valid', () => {
    service.login({ email: 'cataboi@cataboi.com.br', senha: 'cataboi' }).subscribe();

    const request = httpMock.expectOne('http://localhost:8080/auth/login');
    request.error(new ProgressEvent('error'));

    expect(service.getToken()).toBe('mock-cataboi-demo-token');
    expect(service.getCurrentUser()?.email).toBe('cataboi@cataboi.com.br');
    expect(service.isClientAdmin()).toBe(true);
  });

  it('should reject invalid credentials when API login fails', () => {
    let rejected = false;

    service.login({ email: 'invalid@test.com', senha: 'wrong' }).subscribe({
      error: () => {
        rejected = true;
      },
    });

    const request = httpMock.expectOne('http://localhost:8080/auth/login');
    request.error(new ProgressEvent('error'));

    expect(rejected).toBe(true);
    expect(service.getToken()).toBeNull();
  });

  it('should restore a persisted mock session on refresh', () => {
    service.login({ email: 'cataboi@cataboi.com.br', senha: 'cataboi' }).subscribe();
    const request = httpMock.expectOne('http://localhost:8080/auth/login');
    request.error(new ProgressEvent('error'));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const restoredService = TestBed.inject(AuthService);

    expect(restoredService.getToken()).toBe('mock-cataboi-demo-token');
    expect(restoredService.getCurrentUser()?.email).toBe('cataboi@cataboi.com.br');
  });
});
