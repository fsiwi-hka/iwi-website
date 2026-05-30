import { useEffect, useState } from "react";
import Accordion from "./accordion";
import ProtokollBox from "./protokollbox";

type Ordner = {
  Ordnername: string;
  folderDisplayName: string;
  Inhalt: string[];
};

export default function DownloadsList() {
  const [ordner, setOrdner] = useState<Ordner[]>([]);

  useEffect(() => {
    fetch("/api/loader_sitzungsprotokolle")
      .then((res) => res.json())
      .then((data: Ordner[]) => setOrdner(data))
      .catch((err) => console.error("Fehler beim Abrufen:", err));
  }, []);

  return (
    <div>
      {ordner.map(({ Ordnername, folderDisplayName, Inhalt }) => (
        <div key={Ordnername}>
          <Accordion title={folderDisplayName}>
            {Inhalt.map((file) => (
              <ProtokollBox
                key={file}
                buttontext="Herunterladen"
                buttonlink={`/assets/downloads/sitzungsprotokolle/${Ordnername}/${file}`}
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
