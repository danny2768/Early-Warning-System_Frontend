import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NetworkResponse } from '../interfaces/network-resp.interface';
import { StationResponse } from '../interfaces/stations-resp.interface';
import { UserResponse } from '../interfaces/users-resp.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = environments.baseUrl;

  constructor(
    private http: HttpClient,
  ) { }

  // # Networks requests
  getNetworks() {
    return this.http.get<NetworkResponse>(`${this.baseUrl}/api/networks`);
  }

  // # Stations requests
  getStations() {
    return this.http.get<StationResponse>(`${this.baseUrl}/api/stations`);
  }

  // # Readings requests

  // # Users requests
  getUsers() {
    return this.http.get<UserResponse>(`${this.baseUrl}/api/users`);
  }
}
