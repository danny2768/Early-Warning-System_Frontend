import { Pipe, PipeTransform } from '@angular/core';
import { Network } from '../../shared/interfaces/network.interface';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'searchNetwork'
})
export class SearchNetworkPipe implements PipeTransform {

  constructor(
    private datePipe: DatePipe
  ) {}

  transform(networks: Network[], searchText: string): Network[] {
    if (!networks || !searchText) {
      return networks;
    }
    searchText = searchText.toLowerCase();
    return networks.filter(network =>
      network.id.toString().includes(searchText) ||
      network.name.toLowerCase().includes(searchText.toLowerCase()) ||
      network.description.toLowerCase().includes(searchText.toLowerCase()) ||
      (this.datePipe.transform(network.createdAt, 'MMMM d, y, h:mm:ss a') || '').toLowerCase().includes(searchText) ||
      (this.datePipe.transform(network.updatedAt, 'MMMM d, y, h:mm:ss a') || '').toLowerCase().includes(searchText)
    );
  }
}
