import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { environments } from '../../../../environments/environment';
import { LngLat, LngLatBounds, Map, Marker, Popup } from 'mapbox-gl';
import { MapStyle } from '../../interfaces/map-style.type';
import { Station } from '../../../shared/interfaces/station.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit, OnChanges {

  @Input()
  public style: MapStyle = 'standard';
  private availableStyles: Record<string, string> = {
    'standard': "mapbox://styles/mapbox/standard",
    'streets': "mapbox://styles/mapbox/streets-v12",
    'satellite': "mapbox://styles/mapbox/satellite-streets-v12"
  };

  @Input()
  public stations: Station[] = [];
  private mapMarkers: Marker[] = [];

  @ViewChild('map')
  public divMap?: ElementRef;

  public map?: Map;

  @Input()
  public zoom: number = 1.2;
  public currentLngLat: LngLat = new LngLat(-73.120454, 7.140268);

  public isMapLoading: boolean = true;

  public dialogInfo = {
    showDialog: false,
    title: '',
    description: ''
  }

  constructor(
    private adminService: AdminService,
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
    this.buildMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['style'] && !changes['style'].isFirstChange()) {
      this.updateMapStyle();
    }

    if (changes['stations'] && !changes['stations'].isFirstChange()) {
      this.deleteActiveMarkers();
      this.addStationsMarkers( this.stations );
      this.zoomToAllMarkers();
    }

    if (changes['zoom'] && !changes['zoom'].isFirstChange()) {
      this.map?.zoomTo(this.zoom);
    }
  }

  updateMapStyle(): void {
    const newStyle = this.availableStyles[this.style.toLowerCase()];
    this.map?.setStyle(newStyle);
  }

  buildMap(): void {
    if (!this.divMap) throw new Error('Html map element not found');

    this.map = new Map({
      accessToken: environments.mapbox_key,
      container: this.divMap.nativeElement, // container ID
      style: this.availableStyles[this.style], // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
      maxZoom: 19,
      minZoom: 1,
    });

    this.map.on('load', () => {
      setTimeout(() => {
        this.isMapLoading = false;
      }, 1000);
    });

    this.map.on('error', (error) => {
      // console.error('Error on map', error);
      this.displayDialog('Error', 'An error occurred while loading the map. Please try again later.');
    });
  }

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

  addStationsMarkers(stations: Station[]): void {
    if(!this.map) return;

    stations.forEach(station => {
      // Creating popup for the marker
      const popup = this.createStationPopup(station);
      // Creating marker
      const marker = new Marker({ color: '#C0FF00' })
        .setLngLat([station.coordinates.longitude, station.coordinates.latitude])
        .setPopup(popup)
        .addTo(this.map!);
      this.mapMarkers.push(marker);
    });
  }

  createStationPopup(station: Station): Popup {
    const popup = new Popup({
      closeButton: true,
      focusAfterOpen: false,
    }).setHTML(`
        <div class="font-bold text-lg">
          ${station.name}
        </div>

        <div class="mb-2 select-text">
          <div>
            <strong>Country code: </strong>${station.countryCode}
          </div>
          <div>
            <strong>State: </strong>${station.state}
          </div>
          <div>
            <strong>Coordinates: </strong>${(station.coordinates.latitude).toFixed(6)}, ${(station.coordinates.longitude).toFixed(6)}
          </div>
          <div>
            <strong>Network: </strong>${station.networkId}
          </div>
        </div>

        <button id="view-details-btn" class="bg-blue-500 text-white text-base font-semibold py-1 px-4 rounded-box w-full select-none"">
          <a>View details</a>
        </button>
      `);

    // Add event listener to the button
    popup.on('open', () => {
      document.getElementById('view-details-btn')?.addEventListener('click', () => {
        this.router.navigate(['/admin/station-detail', station.id]);
      });
    });

    return popup;
  }

  deleteActiveMarkers() {
    this.mapMarkers.forEach(marker => marker.remove());
    this.mapMarkers = [];
  }

  zoomToAllMarkers() {
    if (!this.map || this.mapMarkers.length === 0) return;

    const bounds = new LngLatBounds();

    this.mapMarkers.forEach(marker => {
      bounds.extend(marker.getLngLat());
    });

    this.map.fitBounds(bounds, {
      offset: [0, 20],
      padding: 80,
      duration: 2500,
      maxZoom: 15,
    });
  }

  public getCurrentZoom(): number {
    return this.map?.getZoom() || this.zoom;
  }
}
