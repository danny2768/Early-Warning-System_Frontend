import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Station } from '../../shared/interfaces/station.interface';

@Pipe({
  name: 'searchStation'
})
export class SearchStationPipe implements PipeTransform {

  constructor(
    private datePipe: DatePipe
  ) {}

  transform(stations: Station[], searchText: string): Station[] {
    if (!stations || !searchText) {
      return stations;
    }
    searchText = searchText.toLowerCase();
    return stations.filter(station =>
      station.id.toString().includes(searchText) ||
      station.name.toLowerCase().includes(searchText.toLowerCase()) ||
      station.state.toLowerCase().includes(searchText.toLowerCase()) ||
      station.countryCode.toLowerCase().includes(searchText.toLowerCase()) ||
      station.coordinates.latitude.toString().includes(searchText) ||
      station.coordinates.latitude.toString().includes(searchText) ||
      (this.datePipe.transform(station.createdAt, 'MMMM d, y, h:mm:ss a') || '').toLowerCase().includes(searchText) ||
      (this.datePipe.transform(station.updatedAt, 'MMMM d, y, h:mm:ss a') || '').toLowerCase().includes(searchText)
    );
  }
}


