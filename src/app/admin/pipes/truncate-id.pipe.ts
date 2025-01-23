import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateId'
})
export class TruncateIdPipe implements PipeTransform {

  transform(value: string | undefined): string {
    if (value === undefined || value === null) {
      return '...';
    }
    const truncatedId = value.slice(-4);
    return `...${truncatedId}`;
  }

}
