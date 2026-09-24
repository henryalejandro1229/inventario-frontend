import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';
import { showLoading, showNotifyError, showNotifySuccess } from '../../../shared/utils/sweetalert';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
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
    password: ['', [Validators.required, Validators.minLength(3)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    showLoading();
    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        showLoading(false);
        void showNotifySuccess('Sesión iniciada correctamente.');
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
        void this.router.navigateByUrl(returnUrl);
      },
      error: (error: unknown) => {
        showLoading(false);
        void showNotifyError('No fue posible iniciar sesión. Verifica tus credenciales.', error);
        this.isSubmitting = false;
      }
    });
  }
}
