import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact, ContactRequest } from './models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private readonly http = inject(HttpClient);

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('/contacts');
  }

  createContact(request: ContactRequest): Observable<Contact> {
    return this.http.post<Contact>('/contacts', request);
  }
}