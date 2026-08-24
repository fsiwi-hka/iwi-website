import React, { useState } from "react";
import { Mitglied } from "../../content/member";
import MemberAvatar, { anzeigeName } from "./member-avatar";

interface FsMitgliederProps {
  mitglieder: (Mitglied | null)[]; // Das Array kann auch null-Werte enthalten
}

const FsMitglieder: React.FC<FsMitgliederProps> = ({ mitglieder }) => {
  return (
    <div className="max-w-screen-xl w-full md:m-auto">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-8 mb-4 md:mb-12">
        {mitglieder.map((mitglied: Mitglied, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-start"
          >
            {mitglied ? (
              <MitgliedKachel mitglied={mitglied} />
            ) : (
              <div className="w-full h-full rounded-full mb-4"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Eigene Komponente, weil jede Kachel ihre eigene Auswahl behalten muss.
const MitgliedKachel: React.FC<{ mitglied: Mitglied }> = ({ mitglied }) => {
  const [ausgewaehlt, setAusgewaehlt] = useState<number | null>(null);

  return (
    <>
      <MemberAvatar
        personen={mitglied.personen}
        ausgewaehlt={ausgewaehlt}
        onAuswahl={setAusgewaehlt}
        className="w-full mb-2"
      />
      <p className="text-center font-bold petrol_text no-margin">{mitglied.position}</p>
      <p className="text-center text-gray-700">{anzeigeName(mitglied.personen, ausgewaehlt)}</p>
    </>
  );
};

export default FsMitglieder;
