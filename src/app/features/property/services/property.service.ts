import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    return this.http.get<Page<Property>>(
        `${this.apiUrl}?page=${page}&size=${size}`
      );
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
}
