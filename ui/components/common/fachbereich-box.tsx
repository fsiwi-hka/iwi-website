import React from "react";
import {Fachbereich, departmentLead} from "../../content/departments";

interface FachbereichBoxProps {
  fachbereich: Fachbereich; // Fachbereich aus content/departments.ts
}

// Zeigt einen Fachbereich mit Teamlead und Aufgabenbereich.
// Der Teamlead wird anhand der "position" aus der Mitgliederliste (content/member.ts) aufgelöst.
const FachbereichBox: React.FC<FachbereichBoxProps> = ({ fachbereich }) => {
  const teamlead = departmentLead(fachbereich);
  const gesucht =
    !teamlead || teamlead.name.length == 0 || teamlead.name == "Wird gesucht!";

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-2">
        <img
          src={
            gesucht
              ? "/images/fachschaft/placeholder_gesucht.jpg"
              : teamlead.img?.length > 0
              ? teamlead.img
              : "/images/fachschaft/placeholder.jpg"
          }
          alt={gesucht ? "Wird gesucht!" : teamlead.name}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div>
          <h4 className="no-margin">{fachbereich.position}</h4>
          <p className="petrol_text no-margin">
            {gesucht ? "Wird gesucht!" : teamlead.name}
          </p>
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
