import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {

  private roleHierarchy: { [key: string]: number } = {
    'SUPER_ADMIN_ROLE': 3,
    'ADMIN_ROLE': 2,
    'USER_ROLE': 1
  };

  private roleDisplayNames: { [key: string]: string } = {
    'SUPER_ADMIN_ROLE': 'Super Admin',
    'ADMIN_ROLE': 'Admin',
    'USER_ROLE': 'User'
  };

  transform(roles: string[] | undefined): string {
    if (!roles || roles.length === 0) {
      return 'Unknown';
    }

    const highestRole = roles.reduce((prev, current) => {
      return (this.roleHierarchy[current] > this.roleHierarchy[prev]) ? current : prev;
    }, roles[0]);

    return this.roleDisplayNames[highestRole] || highestRole;
  }
}
