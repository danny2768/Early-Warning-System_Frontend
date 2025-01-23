import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Station } from '../../../shared/interfaces/station.interface';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country } from '../../../shared/interfaces/country.interface';

@Component({
  selector: 'admin-station-form-modal',
  templateUrl: './station-form-modal.component.html',
  styleUrl: './station-form-modal.component.css',
})
export class StationFormModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input({ required: true })
  title!: string;

  @Input({ required: true })
  action!: 'create' | 'update';

  @Input({ required: true })
  networkId!: string;

  @Input()
  station?: Station;

  @Output()
  closeEvent = new EventEmitter<void>();

  public showForm: boolean = true;

  public dialogMessage = {
    title: 'Error',
    description: 'An error has occurred.',
  };

  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    state: ['', [Validators.required]],
    countryCode: ['', [Validators.required]],
    latitude: ['', [Validators.required]],
    longitude: ['', [Validators.required]],
    isVisibleToUser: [true, Validators.required]
  });

  public countries: WritableSignal<Country[]> = signal([]);

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.action === 'update') {
      if (!this.station) {
        this.showForm = false;
        this.dialogMessage.description = 'Station not found.';
        return;
      }
      const { coordinates, ...stationWithoutCoordinates } = this.station;
      this.myForm.patchValue(stationWithoutCoordinates);
      this.myForm.patchValue({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
    }

    this.getCountries();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCountries(): void {
    this.adminService.getCountries()
      .subscribe({
        next: (countries: Country[]) => this.countries.set(countries),
        error: (err) => {
          console.error(err);
          this.displayDialog('Error', 'An error occurred while loading the countries. Please try again later.');
        }
      });
  }

  onSubmit(): boolean {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      console.warn('Validation failed');
      return false;
    }

    let coordinates = {
      latitude: this.myForm.value.latitude,
      longitude: this.myForm.value.longitude,
    };

    let station = {
      name: this.myForm.value.name,
      state: this.myForm.value.state,
      countryCode: this.myForm.value.countryCode,
      networkId: this.networkId,
      coordinates,
      isVisibleToUser: this.myForm.value.isVisibleToUser
    } as Station;

    if (this.action === 'create') {
      return this.createStation(station);
    }

    if (this.action === 'update') {
      if (!this.station) {
        this.displayDialog('Error', 'Station not found.');
        return false;
      }

      station = { ...this.station, ...station };
      return this.updateStation(station);
    }

    return false;
  }

  private createStation(station: Station): boolean {
    this.adminService
      .createStation(station)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.displayDialog('Success', 'Station created successfully');
          this.myForm.reset();

          return true;
        },
        error: (err) => {
          console.error(err);
          if (err.error.error) {
            this.displayDialog('Error', err.error.error);
          } else {
            this.displayDialog(
              'Error',
              'An error occurred while creating the station. Please try again later.'
            );
          }
          return false;
        },
      });

    return false;
  }

  private updateStation(station: Station) {
    this.adminService
      .updateStation(station)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.displayDialog('Success', 'Station updated successfully');
          this.myForm.reset();

          return true;
        },
        error: (err) => {
          if (err.error.error) {
            this.displayDialog('Error', err.error.error);
          } else {
            this.displayDialog(
              'Error',
              'An error occurred while updating the station. Please try again later.'
            );
          }
          return false;
        },
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
          return `This field is required`;
      }
    }
    return null;
  }
}
