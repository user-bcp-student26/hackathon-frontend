import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { apiErrorMessage } from '../../core/api/api-error';
import { KycService } from '../kyc/kyc.service';
import {
  DocumentType,
  KycVerification,
} from '../kyc/models/kyc-verification.model';
import { Wallet } from './models/wallet.model';
import { WalletService } from './wallet.service';

type ResourceState = 'unavailable' | 'loading' | 'missing' | 'ready' | 'error';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-wallet-page',
  templateUrl: './wallet.page.html',
  styleUrl: './wallet.page.scss',
})
export class WalletPage {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly walletService = inject(WalletService);
  private readonly kycService = inject(KycService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly wallet = signal<Wallet | null>(null);
  readonly walletState = signal<ResourceState>('unavailable');
  readonly verification = signal<KycVerification | null>(null);
  readonly verificationState = signal<ResourceState>('loading');
  readonly loadingAction = signal(false);
  readonly submitted = signal(false);
  readonly errorMessage = signal('');
  readonly verificationForm = this.formBuilder.group({
    documentType: this.formBuilder.control<DocumentType>('DNI', Validators.required),
    documentNumber: ['', [Validators.required, Validators.maxLength(20)]],
    fullName: ['', [Validators.required, Validators.maxLength(120)]],
    birthDate: ['', Validators.required],
  });

  loadWallet(): void {
    this.walletState.set('loading');
    this.walletService
      .getWallet()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (wallet) => {
        this.wallet.set(wallet);
        this.walletState.set('ready');
        this.loadVerification();
      },
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          this.wallet.set(null);
          this.walletState.set('missing');
          this.verificationState.set('missing');
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
          this.loadVerification();
        },
        error: (error: unknown) => {
          if (error instanceof HttpErrorResponse && error.status === 409) {
            this.loadWallet();
            return;
          }
          this.fail(error, 'No fue posible generar tu wallet. Inténtalo de nuevo.');
        },
      });
  }

  loadVerification(): void {
    this.verificationState.set('loading');
    this.kycService
      .getLatestVerification()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (verification) => {
        this.verification.set(verification);
        this.verificationState.set('ready');
        this.refreshWallet();
      },
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          this.verification.set(null);
          this.verificationState.set('missing');
          return;
        }
        this.fail(error, 'No fue posible consultar tu verificación. Inténtalo de nuevo.');
        this.verificationState.set('error');
      },
    });
  }

  submitVerification(): void {
    this.submitted.set(true);
    this.errorMessage.set('');
    if (this.verificationForm.invalid) {
      this.verificationForm.markAllAsTouched();
      return;
    }

    this.loadingAction.set(true);
    this.kycService
      .submitVerification(this.verificationForm.getRawValue())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingAction.set(false)),
      )
      .subscribe({
        next: (verification) => {
          this.verification.set(verification);
          this.verificationState.set('ready');
          this.verificationForm.reset({
            documentType: 'DNI',
            documentNumber: '',
            fullName: '',
            birthDate: '',
          });
          this.refreshWallet();
        },
        error: (error: unknown) => {
          this.fail(error, 'No fue posible verificar tu identidad. Revisa tus datos e inténtalo de nuevo.');
        },
      });
  }

  fieldError(control: AbstractControl, label: string): string {
    if (!control.invalid || (!control.touched && !this.submitted())) {
      return '';
    }
    if (control.hasError('required')) {
      return `Ingresa ${label}.`;
    }
    if (control.hasError('maxlength')) {
      return `${label} supera la longitud permitida.`;
    }
    return 'Revisa este campo.';
  }

  isStatus(status: string): boolean {
    return this.verification()?.status === status;
  }

  private refreshWallet(): void {
    this.walletService
      .getWallet()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (wallet) => this.wallet.set(wallet),
      error: (error: unknown) => {
        if (!(error instanceof HttpErrorResponse && error.status === 404)) {
          this.fail(error, 'No fue posible actualizar el estado de tu wallet.');
        }
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