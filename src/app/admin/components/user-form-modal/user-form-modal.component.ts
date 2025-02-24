import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Role, User } from '../../../shared/interfaces/user.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'admin-user-form-modal',
  templateUrl: './user-form-modal.component.html',
  styleUrl: './user-form-modal.component.css'
})
export class UserFormModalComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  @Input({ required: true })
  title!: string;

  @Input({ required: true })
  user?: User;

  @Output()
  closeEvent = new EventEmitter<void>();

  public showForm: boolean = true;

  public dialogMessage = {
    title: 'Error',
    description: 'An error has occurred.',
  };

  public myForm: FormGroup = this.fb.group({
    name: [''],
    email: [''],
    role: [''],
    phone: this.fb.group({
      countryCode: [''],
      number: [''],
    }),
    emailValidated: [false],
  });

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (!this.user) {
      this.showForm = false;
      this.dialogMessage.description = 'User not found.';
      return;
    }
    this.myForm.patchValue({
      name: this.user.name,
      email: this.user.email  ,
      role: this.getUserHighestRole(this.user.role),
      phone: {
        countryCode: this.user.phone.countryCode,
        number: this.user.phone.number,
      },
      emailValidated: this.user.emailValidated,
    });

    console.log(this.myForm.value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUserHighestRole(roles: Role[]): Role {
    let highestRole: Role = Role.USER;
    for (const role of roles) {
      if (role === Role.SUPER_ADMIN) {
        highestRole = Role.SUPER_ADMIN;
        break;
      } else if (role === Role.ADMIN) {
        highestRole = Role.ADMIN;
      }
    }
    return highestRole;
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      console.warn('No ha cumplido las validaciones');
      return false;
    }

    const updatedUser: Partial<User> = {
      id: this.user!.id,
      name: this.myForm.value.name,
      email: this.myForm.value.email,
      emailValidated: this.myForm.value.emailValidated,
      role: [this.myForm.value.role],
      phone: {
        countryCode: this.myForm.value.phone.countryCode,
        number: this.myForm.value.phone.number
      },
    };

    this.updateUser(updatedUser);

    return false;
  }

  private updateUser(user: Partial<User>): boolean {
    this.adminService.updateUser(user).pipe(takeUntil(this.destroy$)).subscribe({
      next: resp => {
        this.displayDialog('Success', 'User updated successfully.');
        this.myForm.reset();

        return true;
      },
      error: (err: HttpErrorResponse) => {
        if (err.error.error) {
          this.displayDialog('Error', err.error.error);
        } else {
          this.displayDialog('Error', 'An error occurred while updating the user. Please try again later.');
        }
        return false;
      }
    });

    return false;
  }

  onClose() {
    this.closeEvent.emit();
  }

  displayDialog(title: string, message: string): void {
    this.dialogMessage.title = title;
    this.dialogMessage.description = message;
    this.showForm = false;
  }

}
