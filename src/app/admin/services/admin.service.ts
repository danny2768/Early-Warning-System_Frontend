import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NetworkResponse } from '../interfaces/network-resp.interface';
import { StationResponse } from '../../shared/interfaces/stations-resp.interface';
import { UserResponse } from '../interfaces/users-resp.interface';
import { Network } from '../../shared/interfaces/network.interface';
import { Station } from '../../shared/interfaces/station.interface';
import { Country } from '../../shared/interfaces/country.interface';
import { User } from '../../shared/interfaces/user.interface';
import { Sensor } from '../interfaces/sensor.interface';
import { GetSensorReadingsResp } from '../interfaces/get-sensor-readings-resp.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = environments.baseUrl;

  constructor(
    private http: HttpClient,
  ) { }

  public saveToLocalStorage(key: string, value: any) {
    localStorage.setItem( key, JSON.stringify(value) );
  }

  public getFromLocalStorage(key: string) {
    return JSON.parse( localStorage.getItem(key) || 'null' );
  }

  // # Networks requests
  getNetworks( page: number = 1, limit: number = 10 ) {
    return this.http.get<NetworkResponse>(`${this.baseUrl}/api/networks?page=${page}&limit=${limit}`);
  }

  getNetworkById( id: string ) {
    return this.http.get<Network>(`${this.baseUrl}/api/networks/${id}`);
  }

  createNetwork( network: Network ) {
    return this.http.post<Network>(`${this.baseUrl}/api/networks`, network);
  }

  updateNetwork( network: Network ) {
    return this.http.put<Network>(`${this.baseUrl}/api/networks/${network.id}`, network);
  }

  deleteNetwork( id: string ) {
    return this.http.delete<Network>(`${this.baseUrl}/api/networks/${id}`);
  }

  // # Stations requests
  getStations( page: number = 1, limit: number = 10 ) {
    return this.http.get<StationResponse>(`${this.baseUrl}/api/stations?page=${page}&limit=${limit}`);
  }

  getStationById( id: string ) {
    return this.http.get<Station>(`${this.baseUrl}/api/stations/${id}`);
  }

  getStationsByNetworkId( networkId: string, page: number = 1, limit: number = 10 ) {
    return this.http.get<StationResponse>(`${this.baseUrl}/api/stations/by-network/${networkId}?page=${page}&limit=${limit}`);
  }

  createStation( station: Station ) {
    return this.http.post<Station>(`${this.baseUrl}/api/stations`, station);
  }

  updateStation( station: Station ) {
    return this.http.put<Station>(`${this.baseUrl}/api/stations/${station.id}`, station);
  }

  deleteStation( id: string ) {
    return this.http.delete<Station>(`${this.baseUrl}/api/stations/${id}`);
  }

  // # Sensors requests
  getSensorsByStationId( stationId: string ) {
    return this.http.get<Sensor[]>(`${this.baseUrl}/api/sensors/by-station/${stationId}`);
  }

  getSensorReadings( sensorId: string, page: number = 1, limit: number = 1000000 ) {
    return this.http.get<GetSensorReadingsResp>(`${this.baseUrl}/api/sensors/${sensorId}/readings?page=${page}&limit=${limit}`);
  }

  // # Readings requests

  // # Users requests
  getUsers( page: number = 1, limit: number = 10 ) {
    return this.http.get<UserResponse>(`${this.baseUrl}/api/users?page=${page}&limit=${limit}`);
  }

  updateUser( user: Partial<User> ) {
    return this.http.put<User>(`${this.baseUrl}/api/users/${user.id}`, user);
  }

  getUserById( id: string ) {
    return this.http.get<User>(`${this.baseUrl}/api/users/${id}`);
  }

  deleteUser( id: string ) {
    return this.http.delete(`${this.baseUrl}/api/users/${id}`);
  }

  // # Countries
  getCountries() {
    return this.http.get<Country[]>(`${this.baseUrl}/api/countries`);
  }

  // # Common methods

  copyToClipboard(id: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = id;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('ID copied to clipboard');
  }
}
