import { Pipe, PipeTransform } from '@angular/core';
import { Network } from '../../shared/interfaces/network.interface';

@Pipe({
  name: 'sortByNetwork'
})
export class SortByNetworkPipe implements PipeTransform {

  transform(spots: Network[], sortBy?: keyof Network): Network[] {
    switch (sortBy) {
      case 'id':
        return spots.sort((a, b) => (a.id > b.id ? 1 : -1));

      case 'name':
        return spots.sort((a, b) => (a.name > b.name ? 1 : -1));

      case 'description':
        return spots.sort((a, b) => (a.description > b.description ? 1 : -1));

      case 'createdAt':
        return spots.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

      case 'updatedAt':
        return spots.sort((a, b) => (a.updatedAt > b.updatedAt ? 1 : -1));

      default:
        return spots;
    }
  }
}
