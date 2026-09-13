import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { errorMessage } from '../../core/api/api-error';
import { AuthStore } from '../../core/auth/auth.store';
import { APP_CONFIG } from '../../core/config/app-config';
import { fieldErrorText } from '../../shared/forms/validation-messages';
import { Credentials } from '../../shared/models';

@Component({
  selector: 'app-login',
  imports: [
    FormField,
    NgOptimizedImage,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  /** Query-Parameter (withComponentInputBinding): wohin nach dem Login. */
  readonly returnUrl = input<string>();

  protected readonly config = inject(APP_CONFIG);
  protected readonly errorText = fieldErrorText;
  protected readonly model = signal<Credentials>({ username: '', password: '' });
  protected readonly form = form(this.model, (credentials) => {
    required(credentials.username, { message: 'Bitte den Benutzernamen eingeben.' });
    required(credentials.password, { message: 'Bitte das Passwort eingeben.' });
  });
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly hidePassword = signal(true);

  constructor() {
    if (this.auth.isAuthenticated()) {
      void this.router.navigateByUrl(this.safeReturnUrl());
    }
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.form, async () => {
      this.submitting.set(true);
      this.error.set(null);
      try {
        await this.auth.login(this.model());
        await this.router.navigateByUrl(this.safeReturnUrl());
      } catch (error) {
        this.error.set(errorMessage(error));
      } finally {
        this.submitting.set(false);
      }
    });
  }

  /** Nur interne Pfade zulassen (kein Open Redirect ueber `returnUrl`). */
  private safeReturnUrl(): string {
    const url = this.returnUrl();
    return url && url.startsWith('/') && !url.startsWith('//') ? url : '/dashboard';
  }
}
