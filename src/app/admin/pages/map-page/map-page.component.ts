import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapStyle, MapStyleEnum } from '../../interfaces/map-style.type';
import { AdminService } from '../../services/admin.service';
import { Subject, takeUntil } from 'rxjs';
import { Network } from '../../../shared/interfaces/network.interface';
import { Station } from '../../../shared/interfaces/station.interface';
import { MapComponent } from '../../components/map/map.component';

interface NetworkWithSelectionStatus {
  network: Network;
  selected: boolean;
}

interface StationWithSelectionStatus {
  station: Station;
  selected: boolean;
}

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrl: './map-page.component.css'
})
export class MapPageComponent implements OnInit, OnDestroy {

  @ViewChild(MapComponent)
  private mapComponent?: MapComponent;

  @ViewChild('mapStyleDropdown')
  private mapStyleDropdown?: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.resize();
  }

  private destroy$ = new Subject<void>();

  public networks: NetworkWithSelectionStatus[] = [];
  public stations: StationWithSelectionStatus[] = [];

  public mapStations: Station[] = [];

  public mapStyle: MapStyle = 'standard'
  public availableMapStyles: MapStyle[] = Object.keys(MapStyleEnum) as MapStyle[];

  public mapZoom: number = 1.2;

  constructor(
    private adminService: AdminService
  ) {}

  ngAfterViewInit(): void {
    this.resize();
  }

  resize() {
    if (window.innerWidth < 768) {
      this.mapStyleDropdown!.nativeElement.classList.add('dropdown-end');
    } else {
      this.mapStyleDropdown!.nativeElement.classList.remove('dropdown-end');
    }
  }

  ngOnInit(): void {
    this.getNetworks().then(() => {
      // Load the selected networks from localStorage
      const selectedNetworkIds = JSON.parse(localStorage.getItem('selectedNetworks') || '[]');
      this.networks.forEach(network => {
        network.selected = selectedNetworkIds.includes(network.network.id);
      });
    });

    this.getStations().then(() => {
      // Load the selected stations from localStorage
      const selectedStationIds = JSON.parse(localStorage.getItem('selectedStations') || '[]');
      this.stations.forEach(station => {
        station.selected = selectedStationIds.includes(station.station.id);
      });
      this.applyDisplayItems();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getNetworks(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.adminService.getNetworks().pipe( takeUntil(this.destroy$) )
      .subscribe({
        next: (resp) => {
          this.networks = resp.networks.map(network => ({ network, selected: false }));
          resolve();
        },
        error: (err) => {
          console.log(err);
          reject(err);
        }
      })
    });
  }

  private async getStations(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.adminService.getStations().pipe( takeUntil(this.destroy$) )
        .subscribe({
          next: (resp) => {
            this.stations = resp.stations.map(station => ({ station, selected: false }));
            resolve();
          },
          error: (err) => {
            console.log(err);
            reject(err);
          }
        })
    });
  }

  selectAll(event: any, items: NetworkWithSelectionStatus[] | StationWithSelectionStatus[]) {
    const isChecked = event.target.checked;
    items.forEach(item => {
      item.selected = isChecked;
      if ('network' in item) {
        this.selectNetworkStations(item.network.id, { target: { checked: isChecked } } as unknown as Event);
      }
    });
  }

  selectNetworkStations(networkId: string, event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.checked) {
      this.stations.forEach(station => {
        station.selected = (station.station.networkId === networkId) ? true : station.selected;
      });
    } else {
      this.stations.forEach(station => {
        station.selected = (station.station.networkId === networkId) ? false : station.selected;
      });
    }
  }

  applyDisplayItems() {
    this.mapStations = this.stations.filter(station => station.selected).map(station => station.station);
    const displayOptionsMenu = document.getElementById('displayOptionsMenu') as HTMLDivElement;
    if (displayOptionsMenu) displayOptionsMenu.removeAttribute('open');

    // Save the selected stations to localStorage
    const selectedStationsIds = this.mapStations.map(station => station.id);
    this.adminService.saveToLocalStorage('selectedStations', selectedStationsIds);

    // Save the selected networks to localStorage
    const selectedNetworkIds = this.networks.filter(network => network.selected).map(network => network.network.id);
    this.adminService.saveToLocalStorage('selectedNetworks', selectedNetworkIds);
  }

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
}
