// Anzeigenamen der Routen für die Breadcrumbs (siehe components/common/breadcrumb.tsx).
//
// Key:   Pfad ohne Trailing Slash, so wie ihn der Next-Router liefert
// Value: Name, der dem Nutzer angezeigt wird
//
// Wird eine neue Seite in /pages angelegt, hier den Anzeigenamen ergänzen. Fehlt der
// Eintrag, wird als Fallback der Pfad-Teil aufbereitet ("pre-course" -> "Pre Course").
export const routeNames: Record<string, string> = {
    "/": "Home",
    "/first-year": "Erstsemester",
    "/about": "Fachschaft",
    "/news": "Aktuelles",
    "/studies": "Studium",
    "/contact": "Kontakt",
    "/pre-course": "Programmiervorkurs",
    "/orientation": "O-Phase",
    "/sponsoring": "Sponsoring & Kooperation",
    "/imprint": "Impressum",
};

// Liefert den Anzeigenamen einer Route. Trailing Slashes werden ignoriert, damit
// sowohl "/first-year" als auch "/first-year/" gefunden werden.
export function routeName(path: string): string {
    const segments = path.split("/").filter((segment) => segment);
    const normalizedPath = "/" + segments.join("/");

    if (routeNames[normalizedPath]) {
        return routeNames[normalizedPath];
    }

    // Fallback für Seiten, die (noch) keinen Eintrag haben
    const lastSegment = segments[segments.length - 1] ?? "";
    return lastSegment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
