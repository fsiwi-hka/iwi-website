export interface BulletinBoardConfig {
    /** Wird 1:1 als courseOfStudy an den BulletinBoardController durchgereicht. */
    board: string;
    /** Überschrift des Bretts auf dem Kiosk-Screen. */
    title: string;
    /** Kürzel neben der Überschrift, z. B. "INFB". */
    shortName: string;
}

// Die Bretter der Kiosk-Anzeige (/bulletin) werden von Hand gepflegt - genau wie
// slides.ts und departments.ts. Ein neues Brett hinzufügen heißt: hier einen Eintrag
// ergänzen, mehr nicht.
//
// Die Reihenfolge in dieser Liste ist die Reihenfolge der Rotation. Bretter, die
// gerade keine Beiträge haben, werden übersprungen.
export const bulletinBoards: BulletinBoardConfig[] = [
    {
        board: "STUDENT_COUNCIL",
        title: "Fachschaft IWI",
        shortName: "Fachschaft",
    },
    {
        board: "INFB",
        title: "Informatik Bachelor",
        shortName: "INFB",
    },
    {
        board: "INFM",
        title: "Informatik Master",
        shortName: "INFM",
    },
];
