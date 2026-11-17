import { LinkCardData } from '../../shared/ui/link-card/link-card.model';

export interface PreCourse {
  readonly title: string;
  readonly materials: readonly LinkCardData[];
}

const DIR = '/assets/downloads/vorkurs';

// Die Dateinamen enthalten teils "#", Leerzeichen und Umlaute. Im href muessen die
// kodiert sein, sonst liest der Browser z. B. "C#.pdf" als Fragment "#.pdf".
function file(path: string): string {
  return `${DIR}/${path.split('/').map(encodeURIComponent).join('/')}`;
}

export const REQUIRED_SOFTWARE: readonly LinkCardData[] = [
  {
    title: 'java',
    subtitle: 'IntelliJ IDEA von Jetbrains',
    links: [
      { text: 'Jetbrains IntelliJ IDEA', url: 'https://www.jetbrains.com/idea/' },
      { text: 'Java SE 17', url: 'https://www.oracle.com/de/java/technologies/downloads/' },
    ],
  },
  {
    title: 'cs',
    subtitle: 'Visual Studio Community Edition & .NET',
    links: [
      { text: 'Jetbrains Rider IDE', url: 'https://www.jetbrains.com/rider/' },
      { text: 'Visual Studio', url: 'https://visualstudio.microsoft.com/' },
      { text: 'Microsoft .net SDK', url: 'https://dotnet.microsoft.com/' },
    ],
  },
  {
    title: 'python',
    subtitle: 'python 3.x und Jupyter Lab',
    links: [
      { text: 'Jetbrains Pycharm IDE', url: 'https://www.jetbrains.com/pycharm/' },
      { text: 'Python', url: 'https://www.python.org/' },
      { text: 'Jupyter Lab', url: 'https://jupyter.org/' },
    ],
  },
];

export const COURSES: readonly PreCourse[] = [
  {
    title: 'Vorkurs Java',
    materials: [
      {
        title: 'Tag 1',
        subtitle: 'Java',
        links: [
          { text: 'Folien', url: file('java/tag_1/Vorkurs_Java_Tag1.pdf') },
          { text: 'Aufgaben', url: file('java/tag_1/Vorkurs_Tag1_Java_Aufgaben.pdf') },
        ],
      },
      {
        title: 'Tag 2',
        subtitle: 'Java',
        links: [
          { text: 'Folien', url: file('java/tag_2/Vorkurs_Java_Tag2.pdf') },
          { text: 'Aufgaben', url: file('java/tag_2/Vorkurs_Tag2_Java_Aufgaben.pdf') },
        ],
      },
      {
        title: 'Tag 3',
        subtitle: 'Java',
        links: [
          { text: 'Folien', url: file('java/tag_3/Vorkurs_Java_Tag3.pdf') },
          { text: 'Aufgaben', url: file('java/tag_3/Vorkurs_Tag3_Java_Aufgaben.pdf') },
        ],
      },
      {
        title: 'Tag 4',
        subtitle: 'Java',
        links: [{ text: 'Folien', url: file('java/tag_4/Vorkurs_Java_Tag4.pdf') }],
      },
    ],
  },
  {
    title: 'Vorkurs C#',
    materials: [
      {
        title: 'Tag 1',
        subtitle: 'C#',
        links: [
          { text: 'Folien', url: file('cs/tag_1/Vorkurs_Tag1_C#.pdf') },
          { text: 'Aufgaben', url: file('cs/tag_1/Vorkurs_Tag1_C#_Aufgaben.pdf') },
          { text: 'Lösungen', url: file('cs/tag_1/Vorkurs_Tag1_C#_Loesungen.pdf') },
        ],
      },
      {
        title: 'Tag 2',
        subtitle: 'C#',
        links: [
          { text: 'Folien', url: file('cs/tag_2/Vorkurs_Tag2_C#.pdf') },
          { text: 'Aufgaben', url: file('cs/tag_2/Vorkurs_Tag2_C#_Aufgaben.pdf') },
          { text: 'Lösungen', url: file('cs/tag_2/Vorkurs_Tag2_C#_Loesungen.pdf') },
        ],
      },
      {
        title: 'Tag 3',
        subtitle: 'C#',
        links: [
          { text: 'Folien', url: file('cs/tag_3/Vorkurs_Tag3_C#.pdf') },
          { text: 'Aufgaben', url: file('cs/tag_3/C#_Tag3_Aufgaben.pdf') },
          { text: 'Lösungen', url: file('cs/tag_3/Vorkurs_Tag3_C#_Loesungen.pdf') },
          {
            text: 'Lösungen (VS Code)',
            url: file('cs/tag_3/Vorkurs_Tag3_C#_Lösungen (in VSCode).pdf'),
          },
        ],
      },
      {
        title: 'Tag 4',
        subtitle: 'C#',
        links: [
          { text: 'Folien', url: file('cs/tag_4/Vorkurs_Tag4_C#.pdf') },
          { text: 'Aufgaben', url: file('cs/tag_4/Vorkurs_Tag4_C#_Aufgaben.pdf') },
          // Die Loesungen zu den Aufgaben 4.1-4.8 liegen nur als Screenshot vor.
          // Vorkurs_Tag4_C#_Loesungen.pdf gehoert zu einer anderen Aufgabenreihe (Kaffeemaschine).
          { text: 'Lösungen', url: file('cs/tag_4/Vorkurs_Tag4_C4_new_Lösungen.png') },
          {
            text: 'Weitere Aufgaben',
            url: file('cs/tag_4/Vorkurs_Tag_C#_weitere Aufgaben mit Lösungen.pdf'),
          },
        ],
      },
      {
        title: 'Blackjack',
        subtitle: 'C# – Projekt (Tag 4)',
        links: [
          {
            text: 'Anleitung',
            url: file('cs/tag_4/Blackjack/Blackjack_mitAnweisungen_mitAbfragen.png'),
          },
          { text: 'Lösung', url: file('cs/tag_4/Blackjack/Blackjack_ohneAnweisungen.png') },
          { text: 'Program.cs', url: file('cs/tag_4/Blackjack/Program.cs') },
        ],
      },
      {
        title: 'Schere, Stein, Papier',
        subtitle: 'C# – Projekt (Tag 4)',
        links: [
          {
            text: 'Vorlage',
            url: file('cs/tag_4/Schere Stein Papier/SchereSteinPapier_Vorlage.cs'),
          },
        ],
      },
    ],
  },
  {
    title: 'Vorkurs Python',
    materials: [
      {
        title: 'Tag 1',
        subtitle: 'Python',
        links: [
          { text: 'Notebook', url: file('python/tag_1/Vorkurs_Tag_1.ipynb') },
          { text: 'Aufgaben', url: file('python/tag_1/Vorkurs_Tag_1_Aufgaben.ipynb') },
          { text: 'Lösungen', url: file('python/tag_1/Vorkurs_Tag_1_Loesungen.ipynb') },
          { text: 'Notizen', url: file('python/tag_1/Vorkurs_Tag_1_Notizen.ipynb') },
        ],
      },
      {
        title: 'Tag 2',
        subtitle: 'Python',
        links: [
          { text: 'Notebook', url: file('python/tag_2/Vorkurs_Tag_2.ipynb') },
          { text: 'Aufgaben', url: file('python/tag_2/Vorkurs_Tag_2_Aufgaben.ipynb') },
          { text: 'Lösungen', url: file('python/tag_2/Vorkurs_Tag_2_Loesungen.ipynb') },
          { text: 'Notizen', url: file('python/tag_2/Vorkurs_Tag_2_Notizen.ipynb') },
        ],
      },
      {
        title: 'Tag 3',
        subtitle: 'Python',
        links: [
          { text: 'Notebook', url: file('python/tag_3/Vorkurs_Tag_3.ipynb') },
          { text: 'Aufgaben', url: file('python/tag_3/Vorkurs_Tag_3_Aufgaben.ipynb') },
          { text: 'Bonusaufgaben', url: file('python/tag_3/Vorkurs_Tag_3_Aufgaben_Bonus.ipynb') },
          { text: 'Lösungen', url: file('python/tag_3/Vorkurs_Tag_3_Loesungen.ipynb') },
        ],
      },
      {
        title: 'Tag 4',
        subtitle: 'Python',
        links: [
          { text: 'Notebook', url: file('python/tag_4/Vorkurs_Tag_4.ipynb') },
          { text: 'Aufgaben', url: file('python/tag_4/Vorkurs_Tag_4_Aufgaben.ipynb') },
          { text: 'Lösungen', url: file('python/tag_4/Vorkurs_Tag_4_Loesungen.ipynb') },
          { text: 'diamonds.csv', url: file('python/tag_4/diamonds.csv') },
        ],
      },
    ],
  },
];
