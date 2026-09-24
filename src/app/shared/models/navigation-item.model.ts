import { UserRole } from '../../core/models/user.model';

export interface NavigationItem {
  label: string;
  icon: string;
  route: string;
  roles: UserRole[];
}
