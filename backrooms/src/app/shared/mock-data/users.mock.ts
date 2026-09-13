import { User } from '../models';

export interface MockAccount {
  user: User;
  password: string;
}

/** Zugangsdaten fuer den Mock-Login (Passwort jeweils "backrooms"). */
export const MOCK_ACCOUNTS: readonly MockAccount[] = [
  {
    user: {
      id: 'user-admin',
      username: 'admin',
      displayName: 'Admin (Mock)',
      email: 'kontakt@iwi-hka.de',
      roles: ['admin', 'editor'],
    },
    password: 'backrooms',
  },
  {
    user: {
      id: 'user-redaktion',
      username: 'redaktion',
      displayName: 'Redaktion (Mock)',
      roles: ['editor'],
    },
    password: 'backrooms',
  },
];
