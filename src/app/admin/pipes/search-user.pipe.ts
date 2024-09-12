import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../shared/interfaces/user.interface';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'searchUser'
})
export class SearchUserPipe implements PipeTransform {

  constructor(
    private datePipe: DatePipe
  ) {}

  transform(users: User[], searchText: string): User[] {
    if (!users || !searchText) {
      return users;
    }
    searchText = searchText.toLowerCase();
    return users.filter(user =>
      user.id.toString().includes(searchText) ||
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText) ||
      user.role.join(',').toLowerCase().includes(searchText) ||
      (this.datePipe.transform(user.createdAt, 'MMMM d, y, h:mm:ss a') || '').toLowerCase().includes(searchText) ||
      (this.datePipe.transform(user.updatedAt, 'MMMM d, y, h:mm:ss a') || '').toLowerCase().includes(searchText)
    );
  }
}
