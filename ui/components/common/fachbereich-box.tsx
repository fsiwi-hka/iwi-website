import React, { useState } from "react";
import { Fachbereich, departmentLead } from "../../content/departments";
import MemberAvatar, { anzeigeName } from "./member-avatar";

interface FachbereichBoxProps {
  fachbereich: Fachbereich; // Fachbereich aus content/departments.ts
}

// Zeigt einen Fachbereich mit Teamlead und Aufgabenbereich.
// Der Teamlead wird anhand der "position" aus der Mitgliederliste (content/member.ts) aufgelöst.
// Teilen sich zwei Personen den Fachbereich, stehen beide Bilder klein nebeneinander.
const FachbereichBox: React.FC<FachbereichBoxProps> = ({ fachbereich }) => {
  const teamlead = departmentLead(fachbereich);
  const personen = teamlead?.personen ?? [];
  const [ausgewaehlt, setAusgewaehlt] = useState<number | null>(null);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-2">
        <MemberAvatar
          personen={personen}
          ausgewaehlt={ausgewaehlt}
          onAuswahl={setAusgewaehlt}
          className="w-14 shrink-0"
        />
        <div>
          <h4 className="no-margin">{fachbereich.position}</h4>
          <p className="petrol_text no-margin">{anzeigeName(personen, ausgewaehlt)}</p>
        </div>
      </div>

      <ul>
        {fachbereich.tasks.map((task) => (
          <li key={task}>{task}</li>
        ))}
      </ul>
    </div>
  );
};

export default FachbereichBox;
