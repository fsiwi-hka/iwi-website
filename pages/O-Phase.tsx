import { GetStaticProps } from "next";
import Header from "../components/common/header";
import InfoBox from "../components/common/infobox";
import ResponsiveWrapper from "../components/common/responsive-wrapper";

interface Button {
  text: string;
  url: string;
  buttonNewTab?: boolean;
}

interface NewsBox {
  title: string;
  subtitle: string;
  listElements: string[];
  buttons: Button[];
}

function Index() {
  return (
    <>
      <Header
        title="O-Phasen-Programm"
        subtitle="14.03.2025 (Master) & 17.03.2025 - 21.03.2025 (Bachelor + Master)"
      />

      <ResponsiveWrapper>
        <div className="max-w-screen-xl w-full mx-auto">
          <div className="flex flex-col justify-between">
                        <p>Letzte Aktualisierung: März 2025</p>
            <h3 className="petrol_pale_text mt-4 mb-4"> Was ist die O-Phase? </h3>
            <p>
              Vor und in der ersten Woche finden Veranstaltungen statt, die dir den Einstieg ins Studentenleben erleichtern sollen. 
              Organisiert werden sie von der Hochschule bzw. Fakultät und von der Fachschaft Informatik und Wirtschaftsinformatik (das sind wir).
            </p>
            <InfoBox icon="exclamation">
              Diese Pläne richten sich an alle Studenten der Bachelor Studiengänge Informatik, Medieninformatik, Wirtschaftsinformatik, Internationales IT Business und Data Science. Ebenso für die Masterstudiengänge Wirtschaftsinformatik und Informatik.
            </InfoBox>
            <p>
              Da innerhalb der Fakultät Informatik und Wirtschaftsinformatik verschiedene Programme in der O-Phase angeboten werden, 
              findest du hier zwei Terminpläne. Gegebenenfalls kann es auch innerhalb eines Zeitplans verschiedene Zeitstränge geben, 
              achtet hier auf die betroffene Gruppe. Beachte bitte, dass sich die genaueren Planungen kurzfristig ändern können es lohnt sich also,
              regelmäßig vorbeizuschauen. Über Änderungen während der O-Phase versuchen wir euch rechtzeitig zu informieren.
            </p>
          </div>
        </div>
      </ResponsiveWrapper>

      {/* Tabelle 1: INFORMATIK & MEDIENINFORMATIK */}
      <ResponsiveWrapper>
        <div className="w-full mt-0 mb-4">
          <div className="overflow-x-auto">
            <h3 className="petrol_pale_text mt-4 mb-0"> O-Phasen Plan Sommersemester 2025 für Studiengang Informatik & Medieninformatik </h3>
            <p>
              <i> TBA = to be announced </i>
            </p>

            <table className="w-full border-collapse text-sm md:text-base">
              <thead className="bg-white text-primary_blue font-semibold">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">DATUM</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">ZEIT</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">AKTIVITÄT</th>
                </tr>
              </thead>
              <tbody className="primary_grey">
                <tr>
                  <td className="border border-gray-300 px-4 py-4 align-middle">
                    Freitag 14.03.2025 (nur für Master)
                  </td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">10:00 – 11:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Begrüßung / Informationsveranstaltung</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">11:00 – 12:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">PO-Briefing & Vorstellung Fachschaft + O-Phasen Programm</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">12:00 – 13:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Master Brunch</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">13:00 – 14:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Campusrundgang</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Montag 17.03.2025</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">09:00 – 10:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Begrüßung + Informationsveranstaltungen</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">10:00 – 11:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Einstufungstest</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">11:00 – 12:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Vorstellung Fachschaft + O-Phasen Programm</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">13:00 – 14:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Mittagspause</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">17:00 – 00:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Bar Hopping – 17:15 loslaufen</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Dienstag 18.03.2025</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">09:00 – 12:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Brunch & Sprachkurs Einstufung</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">13:00 – 14:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Mittagspause</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">14:00 – 15:30</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">RZ-Einführungsveranstaltung, Li-HE-Hörsaal</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">15:30 – 16:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">PO-Briefing, E 201</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Mittwoch 19.03.2025</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">08:00 – 11:30</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Vorlesung nach Plan</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">11:30 – 13:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Begrüßung durch die Rektorin (HB-Hörsaal)</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">13:00 – 14:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Mittagspause</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">14:00 – 18:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Rallye, Treffpunkt vor dem E-Bau</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Donnerstag 20.03.2025</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">09:00 – 13:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Vorlesung nach Plan</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">13:00 – 14:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Mittagspause</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">14:00 – 15:30</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Vorlesung nach Plan</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Freitag 21.03.2025</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">08:00 – 13:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Vorlesung nach Plan</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">13:00 – 14:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Mittagspause</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">18:00 – 00:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Erstiabend mit MMT (22:00 draußen / 00:45 innen), B-Foyer</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ResponsiveWrapper>

      {/* Tabelle 2: WI & IIB & DS */}
      <ResponsiveWrapper>
        <div className="w-full mt-6 mb-8">
          <div className="overflow-x-auto">
            <h3 className="petrol_pale_text mt-4 mb-0">
              O-Phasen Plan Sommersemester 2025 für Studiengang Wirtschaftsinformatik & Internationales IT Business & Data Science
            </h3>
            <p>
              <i> TBA = to be announced </i>
            </p>

            <table className="w-full border-collapse text-sm md:text-base">
              <thead className="bg-white text-primary_blue font-semibold">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">DATUM</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">ZEIT</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">AKTIVITÄT</th>
                </tr>
              </thead>
              <tbody className="primary_grey">
                <tr>
                  <td className="border border-gray-300 px-4 py-4 align-middle">
                    Freitag 14.03.2025 (nur für Master)
                  </td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">10:00 – 11:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Begrüßung / Informationsveranstaltung</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">11:00 – 12:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">PO-Briefing & Vorstellung Fachschaft + O-Phasen Programm</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">12:00 – 13:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Master Brunch</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">13:00 – 14:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Campusrundgang</td>
                </tr>

                <tr>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Montag 17.03.2025</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">09:00 – 10:20</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Begrüßung + Informationsveranstaltungen</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">10:20 – 11:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Zugangsdaten + Hochschulsysteme + Studienorganisation + Intranet</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">11:00 – 12:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Vorstellung Fachschaft + O-Phasen Programm</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">13:00 – 14:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Mittagspause</td>
                </tr>

                <tr>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Dienstag 18.03.2025</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">08:30 – 09:30</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Infos zu Mathematik 1</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">09:45 – 12:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">WI-Frühstück, E-003, E-004</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">12:00 – 13:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Campusrundgang & AStA-Vorstellung, Treffpunkt vor der Fachschaft</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">13:00 – 14:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Mittagspause</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">14:00 – 15:30</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">RZ-Einführungsveranstaltung, Li-HE Hörsaal</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">15:30 – 16:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">PO-Briefing, E-113</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">17:00 – 00:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Bar Hopping, Treffpunkt vor dem E-Bau – 17:15 loslaufen</td>
                </tr>

                <tr>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Mittwoch 19.03.2025</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">08:00 – 11:30</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Vorlesung nach Plan</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">11:30 – 13:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Begrüßung durch die Rektorin (Li-HE Hörsaal)</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">13:00 – 14:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Mittagspause</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">14:00 – 18:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Rallye, Treffpunkt vor dem E-Bau</td>
                </tr>

                <tr>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Donnerstag 20.03.2025</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">08:00 – 13:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Vorlesung nach Plan</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">13:00 – 14:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Mittagspause</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">14:00 – 15:30</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Vorlesung nach Plan</td>
                </tr>

                <tr>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Freitag 21.03.2025</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">08:00 – 13:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Vorlesung nach Plan</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">13:00 – 14:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Mittagspause</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">18:00 – 00:00</td>
                  <td className="border border-gray-300 px-4 py-4 align-middle">Erstiabend (22:00 draußen / 00:45 Innen), B-Foyer</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ResponsiveWrapper>
      <ResponsiveWrapper>
        <div className="w-full mt-0 mb-4">
          <div className="overflow-x-auto">
            <h3 className="petrol_pale_text mt-4 mb-0">
              Sonstiges
            </h3>
            <p>
              Weitere Termine der Fakultät und wichtige Infos zum Studienbeginn findest du unter <a className="petrol_pale_text" href="https://www.h-ka.de/studieren/studium-organisieren/einstieg-ins-studium/immatrikulationsinfos-ansprechpartner" target="_blank">Immatrikulationsinfos</a>.
            </p>
            </div>
        </div>
      </ResponsiveWrapper>
    </>
  );
}

export default Index;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      data: {
        title: "O-Phase",
      },
    },
  };
};
