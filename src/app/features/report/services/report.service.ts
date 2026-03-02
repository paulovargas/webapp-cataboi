import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  downloadAnimalsReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/animais/relatorio-total-animais`, {
      responseType: 'blob'
    });
  }

  downloadEventsReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/eventos/relatorio-total-eventos`, {
      responseType: 'blob'
    });
  }

  downloadPropertiesReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/propriedades/relatorio-total-propriedades`, {
      responseType: 'blob'
    });
  }

  downloadHerdsReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/rebanhos/relatorio-total-rebanhos`, {
      responseType: 'blob'
    });
  }
}
