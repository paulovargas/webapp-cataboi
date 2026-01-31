import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Property } from '../models/property.model';
import { Page } from '../../../core/models/page.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private readonly apiUrl = 'http://localhost:8080/propriedades';

  private readonly property: Property[] = [];

  constructor(private readonly http: HttpClient) {}

  getProperties(page = 0, size = 10): Observable<Page<Property>> {
    return this.http.get<Page<Property>>(
        `${this.apiUrl}?page=${page}&size=${size}`
      );
  }
}
