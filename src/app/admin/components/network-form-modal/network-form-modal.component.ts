import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Network } from '../../../shared/interfaces/network.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'admin-network-form-modal',
  templateUrl: './network-form-modal.component.html',
  styleUrl: './network-form-modal.component.css'
})
export class NetworkFormModalComponent implements OnInit, OnDestroy{

  private destroy$ = new Subject<void>();

  @Input({ required: true })
  title!: string;

  @Input({ required: true })
  action!: 'create' | 'update';

  @Input()
  network?: Network;

  @Output()
  closeEvent = new EventEmitter<void>();

  public showForm: boolean = true;

  public dialogMessage = {
    title: 'Error',
    description: 'An error has occurred.',
  };

  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if ( this.action === 'update' ) {
      if ( !this.network ) {
        this.showForm = false;
        this.dialogMessage.description = 'Network not found.';
        return;
      }
      this.myForm.patchValue( this.network );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      console.warn('No ha cumplido las validaciones');
      return false;
    }

    let network = this.myForm.value as Network;

    if ( this.action === 'create' ) {
      this.createNetwork( network );
    }

    if ( this.action === 'update' ) {
      if ( !this.network ) {
        this.displayDialog('Error', 'Network not found.');
        return false;
      }

      network = { ...this.network, ...network };
      this.updateNetwork( network );
    }

    return false;
  }

  private createNetwork( network: Network): boolean {
    this.adminService.createNetwork( network ).pipe(takeUntil(this.destroy$)).subscribe({
      next: resp => {
        this.displayDialog('Success', 'Network created successfully.');
        this.myForm.reset();

        return true;
      },
      error: err => {
        if ( err.error.error ) this.displayDialog('Error', `${err.error.error}.`);
        else this.displayDialog('Error', `An unknown error occurred while creating the network. Please try again later.`);
        // console.error(err);

        return false;
      }
    });

    return false;
  }

  private updateNetwork( network: Network): boolean {
    this.adminService.updateNetwork( network ).pipe(takeUntil(this.destroy$)).subscribe({
      next: resp => {
        this.displayDialog('Success', 'Network updated successfully.');
        this.myForm.reset();

        return true;
      },
      error: (err: HttpErrorResponse) => {
        if (err.error.error ) this.displayDialog('Error', `${err.error.error}.`);
        else this.displayDialog('Error', `An unknown error occurred while updating the network. Please try again later.`);
        // console.error(err);

        return false;
      }
    });

    return false;
  }

  onClose( ) {
    this.closeEvent.emit();
  }

  displayDialog( title: string, message: string):void {
    this.dialogMessage.title = title;
    this.dialogMessage.description = message;
    this.showForm = false;
  }

  // # Validaciones de campos
  isFieldInvalid(field: string): boolean | null {
    return (
      this.myForm.controls[field].errors && this.myForm.controls[field].touched
    );
  }

  getFieldError(field: string): string | null {
    if (!this.myForm.controls[field]) return null;

    const errors = this.myForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return `Este campo es requerido`;
        case 'email':
          return `Debe ingresar un email para continuar`;
      }
    }
    return null;
  }
}
