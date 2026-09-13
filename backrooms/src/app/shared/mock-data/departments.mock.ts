import { Department } from '../models';

/** Entspricht ui/content/departments.ts der Hauptseite. */
export function departmentsMock(): Department[] {
  const updatedAt = '2026-05-12T16:30:00.000Z';
  return [
    {
      id: 'dept-finanzen',
      order: 1,
      position: 'FB Finanzen',
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
      position: 'FB Events',
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
      position: 'FB Sponsoring',
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
      position: 'FB Infrastruktur',
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
      position: 'FB Marketing',
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
      position: 'FB O-Phase',
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
      position: 'FB Fachschaftsraum',
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
      position: 'FB Archiv',
      tasks: [
        'Dokumentation der Fachschaftsarbeit',
        'Bestandspflege der Nextcloud',
        'Protokollierung der Sitzungen',
      ],
      updatedAt,
    },
  ];
}
