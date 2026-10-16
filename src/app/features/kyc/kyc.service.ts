import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KycRequest, KycVerification } from './models/kyc-verification.model';

@Injectable({ providedIn: 'root' })
export class KycService {
  private readonly http = inject(HttpClient);

  getLatestVerification(): Observable<KycVerification> {
    return this.http.get<KycVerification>('/kyc/verifications');
  }

  submitVerification(request: KycRequest): Observable<KycVerification> {
    return this.http.post<KycVerification>('/kyc/verifications', request);
  }
}