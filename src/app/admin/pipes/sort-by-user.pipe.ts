import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../shared/interfaces/user.interface';

@Pipe({
  name: 'sortByUser'
})
export class SortByUserPipe implements PipeTransform {

  transform(users: User[], sortBy?: keyof User): User[] {
    switch (sortBy) {
      case 'id':
        return users.sort((a, b) => (a.id > b.id ? 1 : -1));

      case 'name':
        return users.sort((a, b) => (a.name > b.name ? 1 : -1));

      case 'email':
        return users.sort((a, b) => (a.email > b.email ? 1 : -1));

      case 'emailValidated':
        return users.sort((a, b) => (a.emailValidated > b.emailValidated ? 1 : -1));

      case 'role':
        return users.sort((a, b) => (a.role.join(',') > b.role.join(',') ? 1 : -1));

      case 'createdAt':
        return users.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

      case 'updatedAt':
        return users.sort((a, b) => (a.updatedAt > b.updatedAt ? 1 : -1));

      default:
        return users;
    }
  }
}
