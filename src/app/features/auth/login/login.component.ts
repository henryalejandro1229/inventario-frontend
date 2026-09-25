import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { showNotifyError, showNotifySuccess } from '../../../shared/Utilities';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  hidePassword = true;
  isSubmitting = false;

  readonly form = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(3)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.authService.login(this.form.getRawValue()).subscribe({
      next: async () => {
        this.router.navigate(['/dashboard']);
        await showNotifySuccess('Sesión iniciada correctamente.');
      },
      error: (error: unknown) => {
        void showNotifyError(
          'No fue posible iniciar sesión. Verifica tus credenciales.',
          error,
        );
        this.isSubmitting = false;
      },
    });
  }
}
