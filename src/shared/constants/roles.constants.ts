export const ROLES = {
  USER: 'USER',
  STAFF: 'STAFF',
  ADMIN: 'ADMIN',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];
