import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateSubscription } from '../../shared/interfaces/create-subscription.interface';
import { StationSubscription } from '../../shared/interfaces/subscription.interface';
import { StationResponse } from '../../shared/interfaces/stations-resp.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environments.baseUrl;

  constructor(
    private http: HttpClient,
  ) { }

  public getStations() {
    return this.http.get<StationResponse>(`${this.baseUrl}/api/stations/userVisible`);
  }

  public getSubscriptionsUser() {
    return this.http.get<StationSubscription>(`${this.baseUrl}/api/subscriptions/by-user`);
  }

  public addSubscription( stationId: string ) {
    return this.http.post<StationSubscription>(`${this.baseUrl}/api/subscriptions/add`, { stationId });
  }

  public removeStationFromSubscription( stationId: string ) {
    return this.http.delete<StationSubscription>(`${this.baseUrl}/api/subscriptions/remove-station/${stationId}`);
  }
}
