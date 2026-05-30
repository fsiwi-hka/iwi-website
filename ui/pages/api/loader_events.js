//This script loads events from the Nextcloud Calendar (using the URL from .env) to then be displayed in the frontend

import ical from "node-ical";
import { RRule } from "rrule";

const url = process.env.NEXTCLOUD_URL;
console.log(url);

var testEventsArray = [
  {
    date: "09.10.",
    time: "09:30 – 11:30",
    title: "Frühstücksbrunch mit CAS",
    location: "E004",
    locationLink: "",
    buttonLink: "",
  },
  {
    date: "08. – 11.11.",
    time: "Ganztags",
    title: "Hüttenwochenende mit der Fachschaft",
    location: "AWO Spielberg",
    locationLink: "#",
    buttonLink: "#",
  },
  {
    date: "18.11.",
    time: "Ab 17 Uhr",
    title: "Kaminabend bei dmTECH",
    location: "dmTECH-Zentrale",
    locationLink: "",
    buttonLink: "#",
  },
  {
    date: "24.11.",
    time: "Ab 12 Uhr",
    title: "Tischkickerturnier mit Preisen",
    location: "Geb. B, Foyer",
    locationLink: "",
    buttonLink: "#",
  },
  {
    date: "16.12.",
    time: "11:30 – 14:00 Uhr",
    title: "Weihnachtscafé",
    location: "E013 & E004",
    locationLink: "",
    buttonLink: "",
  },
];

function isLink(text) {
  return typeof text === "string" && /^https?:\/\//.test(text.trim());
}

var eventsArray = [];

const filterDate = new Date("2025-05-01"); // 01.06.2025

async function fetchEvents() {
  try {
    const data = await ical.async.fromURL(url);

    let tempEvents = [];

    for (const event of Object.values(data)) {
      if (event.type !== "VEVENT") continue;

      // Einzelnes Event oder wiederkehrendes Event
      if (event.rrule) {
        // Wiederkehrende Events expandieren
        const options = event.rrule.origOptions;
        const rrule = new RRule(options);

        // Optional: nur Ereignisse innerhalb eines Zeitraums generieren
        const occurrences = rrule.between(new Date("2020-01-01"), new Date("2030-12-31"), true);

        occurrences.forEach((occ) => {
          const duration = event.end - event.start; // Dauer in ms
          const endDate = new Date(occ.getTime() + duration);

          tempEvents.push({
            start: occ,
            end: endDate,
            summary: event.summary,
            description: event.description,
            location: event.location,
            dateOnly: event.start.dateOnly === true,
          });
        });
      } else {
        // Normales Event
        tempEvents.push(event);
      }
    }

    // Events sortieren und formatieren
    eventsArray = tempEvents
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .filter((event) => new Date(event.start) >= filterDate)
      .map((event) => {
        const startDate = new Date(event.start);
        const endDate = new Date(event.end);

        // Datum
        let date = startDate.toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        if (startDate.toDateString() !== endDate.toDateString()) {
          const endDateFormatted = endDate.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          date = `${date} – ${endDateFormatted}`;
        }

        // Uhrzeit
        let time = "";
        if (event.start.dateOnly === true || event.end.dateOnly === true) {
          time = "ganztägig";
        } else {
          const startTime = startDate.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          const endTime = endDate.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          time = startTime !== endTime ? `${startTime} – ${endTime}` : startTime;
        }

        return {
          date,
          time,
          title: event.summary,
          start: event.start,
          end: event.end,
          location: event.location,
          locationLink: null,
          buttonLink: isLink(event.description) ? event.description : null,
          allDay: event.dateOnly === true,
        };
      });

    console.log("Events erfolgreich geladen:", eventsArray.length);
  } catch (error) {
    console.error("Fehler beim Abrufen der Events:", error.message);
  }
}
fetchEvents();

let eventsToDisplay = eventsArray;

export default async function handler(req, res) {
  try {
    // Falls das Array noch leer ist, nochmal abrufen
    if (eventsArray.length === 0) {
      await fetchEvents();
      eventsToDisplay = eventsArray;
    }

    if (req.query.start && req.query.end) {
      const start = parseInt(req.query.start);
      const end = parseInt(req.query.end);

      const result = eventsToDisplay.slice(start, end);

      res.status(200).json({
        events: result,
        total: eventsToDisplay.length,
      });
    } else {
      res.status(400).json({ error: "Start- und End-Parameter erforderlich" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error", details: error.message });
  }
}
