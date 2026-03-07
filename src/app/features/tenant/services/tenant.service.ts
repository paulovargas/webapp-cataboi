import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TenantConfig } from '../models/tenant-config.model';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private readonly apiUrl = `${environment.apiUrl}/admin/tenants`;

  constructor(private readonly http: HttpClient) {}

  getTenants(): Observable<TenantConfig[]> {
    return this.http.get<TenantConfig[]>(this.apiUrl);
  }

  createTenant(tenant: TenantConfig): Observable<void> {
    return this.http.post<void>(this.apiUrl, tenant);
  }

  updateTenant(tenant: TenantConfig): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${tenant.tenantKey}`, tenant);
  }

  deleteTenant(tenantKey: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tenantKey}`);
  }
}
