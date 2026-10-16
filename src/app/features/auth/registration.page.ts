import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { apiErrorMessage } from '../../core/api/api-error';
import { UserService } from './user.service';
import { RegisterRequest } from './models/register-request.model';
import { User } from './models/user.model';
import { AuthFrame } from '../../shared/auth-frame/auth-frame';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthFrame, ReactiveFormsModule, RouterLink],
  selector: 'app-registration-page',
  templateUrl: './registration.page.html',
  styleUrl: './registration.page.scss',
})
export class RegistrationPage {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  readonly steps = [
    'Completa tus datos para crear la cuenta',
    'Ingresa con tu correo y contraseña',
    'Más funciones estarán disponibles próximamente',
  ];
  readonly submitted = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal('');
  readonly registeredUser = signal<User | null>(null);
  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{9,15}$/)]],
    password: ['', [Validators.required, Validators.minLength(8), passwordByteLimit]],
  });

  fieldError(control: AbstractControl, fieldName: string): string {
    if (!control.invalid || (!control.touched && !this.submitted())) {
      return '';
    }

    if (control.hasError('required')) {
      return `Ingresa ${fieldName}.`;
    }
    if (control.hasError('email')) {
      return 'Revisa el formato del correo electrónico.';
    }
    if (control.hasError('pattern')) {
      return 'Usa de 9 a 15 dígitos; el prefijo + es opcional.';
    }
    if (control.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (control.hasError('maxBytes')) {
      return 'La contraseña no puede superar 72 bytes.';
    }
    if (control.hasError('maxlength')) {
      return `${fieldName} supera la longitud permitida.`;
    }

    return 'Revisa este campo.';
  }

  submit(): void {
    this.submitted.set(true);
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request: RegisterRequest = this.form.getRawValue();
    this.submitting.set(true);
    this.userService
      .register(request)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.submitting.set(false)),
      )
      .subscribe({
        next: (user) => {
          this.registeredUser.set(user);
          this.form.reset();
        },
        error: (error: unknown) => {
          this.errorMessage.set(
            error instanceof HttpErrorResponse && error.status === 409
              ? 'Ya existe una cuenta con ese correo. Ingresa con ella o usa otro correo.'
              : apiErrorMessage(error, 'No fue posible crear la cuenta. Revisa tus datos e inténtalo de nuevo.'),
          );
        },
      });
  }
}

function passwordByteLimit(control: AbstractControl): ValidationErrors | null {
  const password = String(control.value ?? '');
  return new TextEncoder().encode(password).length <= 72 ? null : { maxBytes: true };
}