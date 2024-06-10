import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { environments } from '../../../../environments/environment';
import { LngLat, Map } from 'mapbox-gl';
import { MapStyle } from '../../interfaces/map-style.type';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';

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

  @ViewChild('map')
  public divMap?: ElementRef;

  public map?: Map;
  public zoom: number = 1.2;
  public currentLngLat: LngLat = new LngLat(-73.120454, 7.140268);

  public isMapLoading: boolean = true;

  constructor(
    private adminService: AdminService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['style'] && !changes['style'].isFirstChange()) {
      this.updateMapStyle();
    }
  }

  updateMapStyle(): void {
    const newStyle = this.availableStyles[this.style];
    this.map?.setStyle(newStyle);
  }

  ngAfterViewInit(): void {
    this.buildMap();
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
  }

}
