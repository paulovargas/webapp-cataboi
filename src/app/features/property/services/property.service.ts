import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Property } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private properties: Property[] = [
    { id: 1, name: 'Fazenda São João', location: 'Goiás' },
    { id: 2, name: 'Fazenda Santa Maria', location: 'Minas Gerais' }
  ];

  getProperties(): Observable<Property[]> {
    return of(this.properties);
  }
}
