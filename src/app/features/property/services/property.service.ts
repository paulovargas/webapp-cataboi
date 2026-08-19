import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Property } from '../models/property.model';
import { Page } from '../../../core/models/page.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private readonly apiUrl = `${environment.apiUrl}/propriedades`;

  private readonly property: Property[] = [];

  constructor(private readonly http: HttpClient) {}

  getProperties(page = 0, size = 10): Observable<Page<Property>> {
    if (environment.useMockAuth) {
      return of(this.buildMockPage(page, size));
    }

    return this.http.get<Page<Property>>(
        `${this.apiUrl}?page=${page}&size=${size}`
      ).pipe(catchError(() => of(this.buildMockPage(page, size))));
  }

  create(property: Property): Observable<Property> {
    return this.http.post<Property>(this.apiUrl, property);
  }

  update(property: Property): Observable<Property> {
    return this.http.put<Property>(`${this.apiUrl}/${property.id}`, property);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private buildMockPage(page: number, size: number): Page<Property> {
    const content: Property[] = [
      { id: 1, nomePropriedade: 'Fazenda Santa Clara', localidade: 'Uberaba - MG', quantidadeAnimais: 136 },
      { id: 2, nomePropriedade: 'Sitio Boa Vista', localidade: 'Rio Verde - GO', quantidadeAnimais: 84 },
      { id: 3, nomePropriedade: 'Fazenda Primavera', localidade: 'Barretos - SP', quantidadeAnimais: 78 },
    ];

    return {
      content,
      totalElements: content.length,
      totalPages: 1,
      number: page,
      size,
      first: true,
      last: true,
      empty: content.length === 0,
    };
  }
}
