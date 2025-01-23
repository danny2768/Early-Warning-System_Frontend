import { Pipe, PipeTransform } from '@angular/core';
import { Station } from '../../shared/interfaces/station.interface';

@Pipe({
  name: 'sortByStation'
})
export class SortByStationPipe implements PipeTransform {

  transform(stations: Station[], sortBy?: keyof Station): Station[] {
    switch (sortBy) {
      case 'id':
        return stations.sort((a, b) => (a.id > b.id ? 1 : -1));

      case 'name':
        return stations.sort((a, b) => (a.name > b.name ? 1 : -1));

      case 'state':
        return stations.sort((a, b) => (a.state > b.state ? 1 : -1));

      case 'countryCode':
        return stations.sort((a, b) => (a.countryCode > b.countryCode ? 1 : -1));

      case 'networkId':
        return stations.sort((a, b) => (a.networkId > b.networkId ? 1 : -1));

      case 'createdAt':
        return stations.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

      case 'updatedAt':
        return stations.sort((a, b) => (a.updatedAt > b.updatedAt ? 1 : -1));

      default:
        return stations;
    }
  }

}
