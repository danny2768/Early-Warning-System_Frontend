import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { environments } from '../../../../environments/environment';
import { GeolocateControl, LngLat, LngLatLike, Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'admin-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit, OnDestroy{

  @ViewChild('map')
  public divMap?: ElementRef;

  public map?: Map;
  public zoom: number = 1.2;
  public currentLngLat: LngLat = new LngLat(-73.120454, 7.140268);

  constructor(
    private adminService: AdminService,
  ) {}


  ngAfterViewInit(): void {
    this.buildMap();
  }

  ngOnDestroy(): void {

  }

  buildMap(): void {
    if (!this.divMap) throw new Error('Html map element not found');

    this.map = new Map({
      accessToken: environments.mapbox_key,
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
      maxZoom: 19,
      minZoom: 1,
    });
  }

}
