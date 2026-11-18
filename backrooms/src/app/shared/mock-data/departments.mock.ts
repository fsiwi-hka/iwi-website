import { Department } from '../models';

/** Entspricht ui/content/departments.ts der Hauptseite. */
export function departmentsMock(): Department[] {
  const updatedAt = '2026-05-12T16:30:00.000Z';
  return [
    {
      id: 'dept-finanzen',
      order: 1,
      name: 'FB Finanzen',
      leadPositionId: 'position-fb-finanzen',
      tasks: [
        'Verwaltung des Gelds der Fachschaft',
        'Geldmittel über Haushaltsmittelanträge abrufen',
        'Verantwortungsvoller Umgang mit euren Studierendenbeiträgen',
        'Kommunikation mit dem AStA',
      ],
      updatedAt,
    },
    {
      id: 'dept-events',
      order: 2,
      name: 'FB Events',
      leadPositionId: 'position-fb-events',
      tasks: [
        'Planung: Semesterplan aufstellen und Events konzipieren',
        'Organisation: Raumreservierungen, Einkauf und Helferlisten',
        'Durchführung: Koordination vor Ort sowie Auf- und Abbau',
      ],
      updatedAt,
    },
    {
      id: 'dept-sponsoring',
      order: 3,
      name: 'FB Sponsoring',
      leadPositionId: 'position-fb-sponsoring',
      tasks: [
        'Goodies für eure O-Phase organisieren',
        'Firmenkontakte aufbauen und pflegen',
        'Kooperationen für alle Studis im Semester einwerben',
        'Events mit Firmenunterstützung, z. B. Kaminabende',
        'Networking-Möglichkeiten für Werkstudi-, Praxis- und Thesis-Stellen schaffen',
      ],
      updatedAt,
    },
    {
      id: 'dept-infrastruktur',
      order: 4,
      name: 'FB Infrastruktur',
      leadPositionId: 'position-fb-infrastruktur',
      tasks: [
        'Website und Server der Fachschaft betreiben',
        'Cloud und StudiBoard verwalten',
        'Zugänge und Accounts pflegen',
        'Technik für Sitzungen und Veranstaltungen bereitstellen',
      ],
      updatedAt,
    },
    {
      id: 'dept-marketing',
      order: 5,
      name: 'FB Marketing',
      leadPositionId: 'position-fb-marketing',
      tasks: [
        'Social Media',
        'Designen/Erstellen von Plakaten',
        'Informationsverteilung von News und Events',
      ],
      updatedAt,
    },
    {
      id: 'dept-ophase',
      order: 6,
      name: 'FB O-Phase',
      leadPositionId: 'position-fb-ophase',
      tasks: [
        'O-Phase für die Erstsemester planen',
        'Erstiheft und Zeitplan erstellen',
        'Programmiervorkurs mitorganisieren',
      ],
      updatedAt,
    },
    {
      id: 'dept-raum',
      order: 7,
      name: 'FB Fachschaftsraum',
      leadPositionId: 'position-fb-raum',
      tasks: [
        'Verbrauchsmaterialien organisieren und nachbestellen',
        'Pflanzen pflegen und erhalten',
        'Sauberkeit, Ordnung und Hygiene sicherstellen',
        'Raumentwicklung planen und Verbesserungen umsetzen',
      ],
      updatedAt,
    },
    {
      id: 'dept-archiv',
      order: 8,
      name: 'FB Archiv',
      leadPositionId: 'position-fb-archiv',
      tasks: [
        'Dokumentation der Fachschaftsarbeit',
        'Bestandspflege der Nextcloud',
        'Protokollierung der Sitzungen',
      ],
      updatedAt,
    },
  ];
}
