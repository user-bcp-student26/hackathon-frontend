import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { apiErrorMessage } from '../../core/api/api-error';
import { Contact, ContactRequest } from './models/contact.model';
import { ContactsService } from './contacts.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  selector: 'app-contacts-page',
  templateUrl: './contacts.page.html',
  styleUrl: './contacts.page.scss',
})
export class ContactsPage {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly contactsService = inject(ContactsService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly contacts = signal<Contact[]>([]);
  readonly unavailable = true;
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{9,15}$/)]],
    wallet_id: ['', [Validators.required, Validators.pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)]],
  });

  loadContacts(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.contactsService
      .getContacts()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (contacts) => this.contacts.set(contacts),
        error: (error: unknown) => {
          this.fail(error, 'No fue posible cargar tus contactos. Inténtalo de nuevo.');
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
    if (control.hasError('pattern') && control === this.form.controls.phone) {
      return 'Usa de 9 a 15 dígitos; el prefijo + es opcional.';
    }
    if (control.hasError('pattern')) {
      return 'Ingresa un wallet_id con formato UUID.';
    }
    if (control.hasError('maxlength')) {
      return `${label} supera la longitud permitida.`;
    }
    return 'Revisa este campo.';
  }

  submit(): void {
    this.submitted.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request: ContactRequest = this.form.getRawValue();
    this.submitting.set(true);
    this.contactsService
      .createContact(request)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.submitting.set(false)),
      )
      .subscribe({
        next: (contact) => {
          this.contacts.update((contacts) => [contact, ...contacts]);
          this.form.reset();
          this.submitted.set(false);
          this.successMessage.set('Contacto registrado.');
        },
        error: (error: unknown) => {
          this.fail(error, 'No fue posible registrar el contacto. Revisa el wallet_id e inténtalo de nuevo.');
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