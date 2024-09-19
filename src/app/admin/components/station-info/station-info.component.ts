import { Component, ElementRef, Input, OnChanges, OnDestroy, signal, SimpleChanges, ViewChild, WritableSignal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { Station } from '../../../shared/interfaces/station.interface';

@Component({
  selector: 'admin-station-info',
  templateUrl: './station-info.component.html',
  styleUrl: './station-info.component.css'
})
export class StationInfoComponent {

  private destroy$ = new Subject<void>();

  @Input({ required: true })
  public station: WritableSignal<Station | undefined> = signal(undefined);


  @ViewChild('drawerToggle')
  drawerToggle!: ElementRef<HTMLInputElement>;

  constructor( private adminService: AdminService ) {}

  openSideSheet() {
    this.drawerToggle.nativeElement.checked = true;
  }

  closeSideSheet() {
    this.drawerToggle.nativeElement.checked = false;
  }

  copyToClipboard(id: string): void {
    this.adminService.copyToClipboard(id);
  }

}
