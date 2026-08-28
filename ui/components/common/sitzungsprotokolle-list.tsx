import { useEffect, useState } from "react";
import Accordion from "./accordion";
import ProtokollBox from "./protokollbox";

type ProtocolIndex = Record<string, string[]>; // Semester -> Dateinamen

export default function DownloadsList() {
  const [ordner, setOrdner] = useState<[string, string[]][]>([]);

  useEffect(() => {
    // Proxy leitet /api/... ans Backend weiter
    fetch("/api/protocols")
        .then((res) => res.json())
        .then((data: ProtocolIndex) => {
          // neueste Semester zuerst
          const entries = Object.entries(data).sort(
              ([a], [b]) => semesterSortKey(b) - semesterSortKey(a)
          );
          setOrdner(entries);
        })
        .catch((err) => console.error("Fehler beim Abrufen:", err));
  }, []);

  return (
      <div>
        {ordner.map(([semester, files]) => (
            <div key={semester}>
              <Accordion title={formatSemester(semester)}>
                {files.map((file) => (
                    <ProtokollBox
                        key={file}
                        buttontext="Herunterladen"
                        buttonlink={`/api/protocols/${encodeURIComponent(file)}`}
                        buttonNewTab
                    >
                      {file.replace(/\.pdf$/i, "")}
                    </ProtokollBox>
                ))}
              </Accordion>
            </div>
        ))}
      </div>
  );
}

// "25WS" -> "WS 2025/26", "26SS" -> "SS 2026"
function formatSemester(key: string) {
  const year = 2000 + Number(key.slice(0, 2));
  const term = key.slice(2).toUpperCase();
  return term === "WS" ? `WS ${year}/${(year + 1) % 100}` : `SS ${year}`;
}

// chronologisch: WS liegt nach dem SS desselben Jahres
function semesterSortKey(key: string) {
  const year = 2000 + Number(key.slice(0, 2));
  const term = key.slice(2).toUpperCase();
  return year * 2 + (term === "WS" ? 1 : 0);
}