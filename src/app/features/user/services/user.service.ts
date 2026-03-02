import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Page } from '../../../core/models/page.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/usuario`;

  constructor(private readonly http: HttpClient) {}

  getUsers(page = 0, size = 10): Observable<Page<User>> {
    return this.http.get<Page<User>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  updateMe(user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/me`, user);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.idusu}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
