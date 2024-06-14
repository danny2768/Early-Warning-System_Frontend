import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NetworkResponse } from '../interfaces/network-resp.interface';
import { StationResponse } from '../interfaces/stations-resp.interface';
import { UserResponse } from '../interfaces/users-resp.interface';
import { Network } from '../../shared/interfaces/network.interface';
import { Station } from '../../shared/interfaces/station.interface';

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

  // # Stations requests
  getStations( page: number = 1, limit: number = 10 ) {
    return this.http.get<StationResponse>(`${this.baseUrl}/api/stations?page=${page}&limit=${limit}`);
  }

  // # Readings requests

  // # Users requests
  getUsers() {
    return this.http.get<UserResponse>(`${this.baseUrl}/api/users`);
  }
}
