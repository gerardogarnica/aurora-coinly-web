import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '@features/auth/services/auth.service';
import { ProcessStatus } from '@shared/models/process-status.model';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputText, ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html'
})
export default class LoginComponent {
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  messageService = inject(MessageService);

  processStatus: ProcessStatus = 'none';

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]]
  });

  resetForm() {
    this.loginForm.reset();
    this.processStatus = 'none';
  }

  onLogin() {
    if (this.loginForm.valid && this.processStatus !== 'loading') {
      this.processStatus = 'loading';
      const formValue = this.loginForm.value;

      this.loginUser(formValue.email, formValue.password);
    }
  }

  loginUser(email: string, password: string) {
    this.authService
      .login(email, password)
      .subscribe({
        next: () => {
          this.processStatus = 'success';
          // Redirect to dashboard or another page after successful login
        },
        error: (error: string) => {
          this.processStatus = 'error';

          this.resetForm();

          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: error,
            life: 2000
          });
        }
      });
  }
}
