import { GetStaticProps } from "next";
import Header from "../components/common/header";
import InfoBox from "../components/common/infobox";
import ResponsiveWrapper from "../components/common/responsive-wrapper";
import OphaseService, {OPhaseInfo} from "./api/ophase-service";
import {useEffect, useState} from "react";
import {DateTime} from "rrule/dist/esm/datetime";

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
  const [info, setInfo] = useState<OPhaseInfo | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    OphaseService
        .getOPhaseInfo(controller.signal)
        .then(x => {
          console.log(x);
          setInfo(x);
        })
        .catch((err) => {
          if (err?.name !== "AbortError") console.error(err);
        });

    console.log(info);

    return () => controller.abort();
  }, []);

  let subtitle =
      (info?.orientierungsphase.beginn
        ? new Date(info?.orientierungsphase.beginn).toLocaleDateString("de-DE")
        : "–") + " - " + new Date(info?.orientierungsphase.ende).toLocaleDateString("de-DE");

  return (
    <>
      <Header
        title="O-Phasen-Programm"
        subtitle={subtitle}
      />

      <ResponsiveWrapper>
        <div className="max-w-screen-xl w-full mx-auto">
          <div className="flex flex-col justify-between">
            <p>
              Letzte Aktualisierung:{" "}
              {info?.changedAt
                  ? new Date(info.changedAt).toLocaleDateString("de-DE")
                  : "–"}
            </p>
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
            <h3 className="petrol_pale_text mt-4 mb-0">
              O-Phasen Plan {info?.semesterName} {info?.semesterYear} für Studiengang Informatik & Medieninformatik
            </h3>
            <p>
              <i> TBA = to be announced </i>
            </p>

            <img src={OphaseService.getTimetableUrl("I")} alt="Stundenplan" />
          </div>
        </div>
      </ResponsiveWrapper>

      {/* Tabelle 2: WI & IIB & DS */}
      <ResponsiveWrapper>
        <div className="w-full mt-6 mb-8">
          <div className="overflow-x-auto">
            <h3 className="petrol_pale_text mt-4 mb-0">
              O-Phasen Plan {info?.semesterName} {info?.semesterYear} für Studiengang Wirtschaftsinformatik & Internationales IT Business & Data Science
            </h3>
            <p>
              <i> TBA = to be announced </i>
            </p>

            <img src={OphaseService.getTimetableUrl("WI")} alt="Stundenplan" />
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
