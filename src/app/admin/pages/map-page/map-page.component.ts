import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapStyle, MapStyleEnum } from '../../interfaces/map-style.type';
import { AdminService } from '../../services/admin.service';
import { Subject, takeUntil } from 'rxjs';
import { Network } from '../../../shared/interfaces/network.interface';
import { Station } from '../../../shared/interfaces/station.interface';

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
    this.getNetworks();
    this.getStations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getNetworks(): void {
    this.adminService.getNetworks().pipe( takeUntil(this.destroy$) )
    .subscribe({
      next: (resp) => {
        this.networks = resp.networks.map(network => ({ network, selected: false }));
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  private getStations(): void {
    this.adminService.getStations().pipe( takeUntil(this.destroy$) )
      .subscribe({
        next: (resp) => {
          this.stations = resp.stations.map(station => ({ station, selected: false }));
        },
        error: (err) => {
          console.log(err);
        }
      })
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
  }
}
