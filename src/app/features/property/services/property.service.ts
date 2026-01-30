import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Property } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private readonly properties: Property[] = [];

  getProperties(): Observable<Property[]> {
    return of(this.properties);
  }
}
