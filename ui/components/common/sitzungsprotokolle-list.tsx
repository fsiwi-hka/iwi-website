import { useEffect, useState } from "react";
import Accordion from "./accordion";
import ProtokollBox from "./protokollbox";
import ProtocolService, {ProtocolIndex} from "../../pages/api/protocol-service";

export default function DownloadsList() {
  const [ordner, setOrdner] = useState<[string, string[]][]>([]);

  useEffect(() => {
    ProtocolService.listProtocols()
        .then((data: ProtocolIndex) => {
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
                        buttonlink={ProtocolService.getProtocolUrl(file)}
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

function formatSemester(key: string) {
  const year = 2000 + Number(key.slice(0, 2));
  const term = key.slice(2).toUpperCase();
  return term === "WS" ? `WS ${year}/${(year + 1) % 100}` : `SS ${year}`;
}

function semesterSortKey(key: string) {
  const year = 2000 + Number(key.slice(0, 2));
  const term = key.slice(2).toUpperCase();
  return year * 2 + (term === "WS" ? 1 : 0);
}