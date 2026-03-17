import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ProfileService } from '@features/profile/services/profile.service';
import { User } from '@features/profile/models/user.model';
import { PageHeaderComponent } from '@shared/components/page-header.component';
import { ProcessStatus } from '@shared/models/process-status.model';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, PageHeaderComponent, ButtonModule, CardModule, InputText, ToastModule],
  providers: [MessageService],
  templateUrl: './profile.component.html'
})
export default class ProfileComponent {
  private readonly profileService = inject(ProfileService);
  private readonly messageService = inject(MessageService);
  private readonly formBuilder = inject(FormBuilder);

  user = signal<User | null>(null);
  processStatus = signal<ProcessStatus>('init');
  saveStatus = signal<ProcessStatus>('init');
  isEditing = false;

  profileForm = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
  });

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.processStatus.set('loading');
    this.profileService.getProfile().subscribe({
      next: (user) => {
        this.user.set(user);
        this.processStatus.set('success');
      },
      error: () => {
        this.processStatus.set('error');
      }
    });
  }

  onEdit() {
    const user = this.user();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName
      });
      this.isEditing = true;
    }
  }

  onCancel() {
    this.isEditing = false;
    this.profileForm.reset();
  }

  onSave() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName } = this.profileForm.getRawValue();
    this.saveStatus.set('loading');

    this.profileService.updateProfile(firstName!, lastName!).subscribe({
      next: () => {
        this.saveStatus.set('success');
        this.isEditing = false;
        this.loadProfile();

        this.messageService.add({
          severity: 'success',
          summary: 'Profile updated',
          detail: 'Your profile has been updated successfully.',
          life: 2000
        });
      },
      error: (error: string) => {
        this.saveStatus.set('error');

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
          life: 2000
        });
      }
    });
  }
}
