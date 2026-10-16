import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { apiErrorMessage } from '../../core/api/api-error';
import { AuthSessionService } from '../../core/auth/auth-session.service';
import { AuthFrame } from '../../shared/auth-frame/auth-frame';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthFrame, ReactiveFormsModule, RouterLink],
  selector: 'app-login-page',
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly steps = [
    'Crea tu cuenta con tus datos',
    'Ingresa con tu correo y contraseña',
    'Más funciones estarán disponibles próximamente',
  ];
  readonly submitted = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal('');
  readonly form = this.formBuilder.group({
    email: [
      this.route.snapshot.queryParamMap.get('email') ?? '',
      [Validators.required, Validators.email, Validators.maxLength(254)],
    ],
    password: ['', [Validators.required]],
  });

  submit(): void {
    this.submitted.set(true);
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.submitting.set(true);
    this.authSession
      .login(email.trim(), password)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.submitting.set(false)),
      )
      .subscribe({
        next: () => void this.router.navigateByUrl('/wallet'),
        error: (error: unknown) => {
          this.errorMessage.set(
            error instanceof HttpErrorResponse && error.status === 401
              ? 'Correo o contraseña incorrectos. Revisa tus datos e inténtalo de nuevo.'
              : apiErrorMessage(error, 'No fue posible ingresar. Inténtalo de nuevo.'),
          );
        },
      });
  }
}