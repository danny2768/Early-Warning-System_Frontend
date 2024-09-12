import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateId'
})
export class TruncateIdPipe implements PipeTransform {

  transform(value: string): string {
    const truncatedId = value ? value.slice(-4) : '';
    return `...${truncatedId}`;
  }

}
