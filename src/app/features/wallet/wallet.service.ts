import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Wallet } from './models/wallet.model';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private readonly http = inject(HttpClient);

  getWallet(): Observable<Wallet> {
    return this.http.get<Wallet>('/wallet');
  }

  createWallet(): Observable<Wallet> {
    return this.http.post<Wallet>('/wallet', null);
  }
}