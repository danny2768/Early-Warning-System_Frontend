import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from '../../components/map/map.component';
import { Subject, takeUntil } from 'rxjs';
import { Station } from '../../../shared/interfaces/station.interface';
import { MapStyle, MapStyleEnum } from '../../../shared/interfaces/map-style.type';
import { UserService } from '../../services/user.service';

interface StationWithSelectionStatus {
  station: Station;
  selected: boolean;
}

@Component({
  selector: 'user-map-page',
  templateUrl: './map-page.component.html',
  styleUrl: './map-page.component.css'
})
export class MapPageComponent implements AfterViewInit, OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  @ViewChild(MapComponent)
  private mapComponent?: MapComponent;

  @ViewChild('mapStyleDropdown')
  private mapStyleDropdown?: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.resize();
  }

  public stations: StationWithSelectionStatus[] = [];
  public mapStations: Station[] = [];

  public mapStyle: MapStyle = 'standard'
  public availableMapStyles: MapStyle[] = Object.keys(MapStyleEnum) as MapStyle[];

  public mapZoom: number = 1.2;

  public dialogInfo = {
    showDialog: false,
    title: '',
    description: ''
  }

  constructor(
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.getStationsAndDisplay();
  }

  ngAfterViewInit(): void {
    this.resize();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getStationsAndDisplay(): void {
    this.userService.getStations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.stations = resp.stations.map(station => ({ station, selected: false }));
          this.mapStations = resp.stations;
        },
        error: (error) => {
          this.displayDialog('Error', 'An error occurred while fetching the stations');
        }
      })
  }

  // # Display & form methods
  applyDisplayItems( closeMenu: boolean = true ) {
    this.mapStations = this.stations.filter(station => station.selected).map(station => station.station);
    if ( closeMenu ) this.closeDisplayOptionsMenu();
  }

  closeDisplayOptionsMenu() {
    const displayOptionsMenu = document.getElementById('displayOptionsMenu') as HTMLDivElement;
    displayOptionsMenu.removeAttribute('open');
  }

  selectAll(event: any, items: StationWithSelectionStatus[]) {
    const isChecked = event.target.checked;
    items.forEach(item => {
      item.selected = isChecked;
    });
  }

  // # Map methods
  changeMapStyle(style: MapStyle ) {
    this.mapStyle = style;
    if ( this.mapStyleDropdown ) this.mapStyleDropdown.nativeElement.removeAttribute('open');
  }

  public zoomIn(): void {
    if (!this.mapComponent) return;
    this.mapZoom = this.mapComponent.getCurrentZoom() + 0.8;
  }

  public zoomOut(): void {
    if (!this.mapComponent) return;
    this.mapZoom = this.mapComponent.getCurrentZoom() - 0.8;
  }

  // # Utility methods
  resize() {
    if (window.innerWidth < 768) {
      this.mapStyleDropdown!.nativeElement.classList.add('dropdown-end');
    } else {
      this.mapStyleDropdown!.nativeElement.classList.remove('dropdown-end');
    }
  }

  // # Dialog methods
  displayDialog( title: string, description: string): void {
    this.dialogInfo = {
      showDialog: true,
      title,
      description
    }
  }

  closeDialog(): void {
    this.dialogInfo.showDialog = false;
  }
}
