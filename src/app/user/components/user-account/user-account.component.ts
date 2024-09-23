import {
  Component,
  effect,
  Input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../shared/interfaces/user.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'user-account',
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.css',
})
export class UserAccountComponent {
  private destroy$ = new Subject<void>();

  @Input({ required: true })
  public user: WritableSignal<User | undefined> = signal(undefined);

  public userForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    phone: this.fb.group({
      countryCode: ['', Validators.required],
      number: ['', Validators.required],
    }),
    emailValidated: [false],
  });

  public dialogInfo = {
    showDialog: false,
    title: '',
    description: '',
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    effect(() => {
      const user = this.user();
      if (user) {
        this.userForm.patchValue(user);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      console.error('Form is invalid');
      return;
    }

    const userFormValue = this.userForm.value;

    const user = this.user();
    if (!user || !user.id) {
      console.error('User not found');
      return;
    }

    const userToUpdate: Partial<User> = {
      id: this.user()!.id,
      name: userFormValue.name,
      email: userFormValue.email,
      phone: {
        countryCode: userFormValue.phone.countryCode,
        number: userFormValue.phone.number,
      },
      emailValidated: userFormValue.emailValidated,
    };

    this.authService
      .updateUser(userToUpdate)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.displayDialog('Success', 'User updated successfully');
          this.user.set(resp);
        },
        error: (err) => {
          this.displayDialog('Error', 'An error occurred while updating the user. Please try again later.');
          switch (err.status) {
            case 400:
              const errorMessage: string = err.error.error;
              if (errorMessage.includes(`The email is already taken by another user.`)) {
                this.displayDialog('Error', 'The email is already taken by another user.');
              } else {
                this.displayDialog('Oops! Something went wrong.', 'An error occurred while processing your request. Please try again later.');
              }
              break;
            default:
              this.displayDialog('Oops! Something went wrong.', 'An error occurred while processing your request. Please try again later.');
              break;
          }
        },
      });
  }

  isFieldInvalid(field: string): boolean | null {
    const control = this.userForm.get(field);
    return control && control.errors && control.touched;
  }

  getFieldError(field: string): string | null {
    const control = this.userForm.get(field);
    if (!control || !control.errors) return null;

    const errors = control.errors;

    if (errors['required']) {
      return 'This field is required';
    }
    if (errors['email']) {
      return 'This field must be a valid email';
    }
    return null;
  }

  validateEmail(): void {
    this.authService.sendValidationEmail()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.displayDialog('Success', 'Validation email sent successfully');
        },
        error: (err) => {
          this.displayDialog('Error', 'An error occurred while sending the validation email. Please try again later.');
          console.error('Error sending validation email', err);
        },
      })
  }

  // # Dialog Methods
  displayDialog(title: string, description: string): void {
    this.dialogInfo = {
      showDialog: true,
      title,
      description,
    };
  }

  closeDialog(): void {
    this.dialogInfo.showDialog = false;
  }
}
