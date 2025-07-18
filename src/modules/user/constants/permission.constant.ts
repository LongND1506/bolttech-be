import { Permission, UserRole } from '../enums';

export const USER_MANAGEMENT_PERMISSIONS = [
  Permission.CREATE_USER,
  Permission.READ_USER,
  Permission.UPDATE_USER,
  Permission.DELETE_USER,
];

export const ROLE_PERMISSION_MAPPER = new Map<UserRole, Permission[]>([
  [UserRole.Admin, [...USER_MANAGEMENT_PERMISSIONS]],
  [UserRole.User, [Permission.READ_USER]],
]);
