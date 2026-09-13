import { Role } from '../../shared/models';
import { IconName } from '../../shared/ui/icon/icons';

export interface NavItem {
  label: string;
  path: string;
  icon: IconName;
  /** Nur fuer diese Rolle sichtbar. */
  role?: Role;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

/** Hauptnavigation der Sidebar. Reihenfolge = Anzeige-Reihenfolge. */
export const NAV_SECTIONS: readonly NavSection[] = [
  {
    label: 'Allgemein',
    items: [{ label: 'Übersicht', path: '/dashboard', icon: 'dashboard' }],
  },
  {
    label: 'Website',
    items: [
      { label: 'Startseiten-Slider', path: '/hero-slides', icon: 'image' },
      { label: 'Mitglieder', path: '/members', icon: 'users' },
      { label: 'Fachbereiche', path: '/departments', icon: 'layers' },
      { label: 'Sponsoren', path: '/sponsors', icon: 'briefcase' },
      { label: 'Semestertermine', path: '/semester-dates', icon: 'calendar' },
      { label: 'Seiten', path: '/pages', icon: 'file-text' },
    ],
  },
  {
    label: 'Fachschaft',
    items: [
      { label: 'Infoscreen', path: '/infoscreen', icon: 'monitor' },
      { label: 'Sitzungsprotokolle', path: '/protocols', icon: 'archive' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Synchronisation', path: '/system', icon: 'refresh' },
      { label: 'Einstellungen', path: '/settings', icon: 'settings', role: 'admin' },
    ],
  },
];
