import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { apiErrorMessage } from '../../core/api/api-error';
import { Wallet } from './models/wallet.model';
import { WalletService } from './wallet.service';

type ResourceState = 'loading' | 'missing' | 'ready' | 'error';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-wallet-page',
  templateUrl: './wallet.page.html',
  styleUrl: './wallet.page.scss',
})
export class WalletPage implements OnInit {
  private readonly walletService = inject(WalletService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly wallet = signal<Wallet | null>(null);
  readonly walletState = signal<ResourceState>('loading');
  readonly loadingAction = signal(false);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadWallet();
  }

  loadWallet(): void {
    this.errorMessage.set('');
    this.walletState.set('loading');
    this.walletService
      .getWallet()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (wallet) => {
        this.wallet.set(wallet);
        this.walletState.set('ready');
      },
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          this.wallet.set(null);
          this.walletState.set('missing');
          return;
        }
        this.fail(error, 'No fue posible cargar tu wallet. Inténtalo de nuevo.');
        this.walletState.set('error');
      },
    });
  }

  createWallet(): void {
    this.errorMessage.set('');
    this.loadingAction.set(true);
    this.walletService
      .createWallet()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingAction.set(false)),
      )
      .subscribe({
        next: (wallet) => {
          this.wallet.set(wallet);
          this.walletState.set('ready');
        },
        error: (error: unknown) => {
          if (error instanceof HttpErrorResponse && error.status === 409) {
            this.errorMessage.set(
              'Ya existe una wallet para tu cuenta, pero no pudimos consultarla. Reintenta la consulta.',
            );
            this.walletState.set('error');
            return;
          }
          this.fail(error, 'No fue posible generar tu wallet. Inténtalo de nuevo.');
        },
      });
  }

  private fail(error: unknown, fallback: string): void {
    if (error instanceof HttpErrorResponse && error.status === 401) {
      this.errorMessage.set('Tu sesión terminó. Ingresa de nuevo para continuar.');
      void this.router.navigateByUrl('/ingresar');
      return;
    }
    this.errorMessage.set(apiErrorMessage(error, fallback));
  }
}