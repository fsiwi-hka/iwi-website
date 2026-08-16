import { GetStaticProps } from "next";

import BoxFullWidthBlue from "../components/common/box-full-width-blue";
import Button from "../components/common/button";
import FachbereichBox from "../components/common/fachbereich-box";
import FsMitglieder from "../components/common/fs-mitglieder";
import Header from "../components/common/header";
import InfoBox from "../components/common/infobox";
import ProtokollBox from "../components/common/protokollbox";
import ResponsiveWrapper from "../components/common/responsive-wrapper";
import Sitzungsprotokolle from "../components/common/sitzungsprotokolle-list";
import {strings} from "@lib/strings";
import {departments} from "../content/departments";
import {members} from "../content/member";

// Vorstand und Ämter unter "Vorstand & Fachschaft", Fachbereiche unter "Fachbereiche"

function Index() {
  return (
    <>
      <Header
        title="Wir sind die Fachschaft IWI"
        subtitle="Hier findest du also Informationen zu uns und wie du uns erreichen kannst. Möchtest du mitmachen oder hast du Fragen und Anregungen? Wir freuen uns auf deine Nachricht."
      ></Header>

      <ResponsiveWrapper>
        <div className="max-w-screen-xl w-full md:m-auto flex flex-col-reverse md:flex-row">
          <div className="flex flex-col justify-between">
            <div>
              <h2>Was ist die Fachschaft?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <p>
                  Im weitesten Sinne gehören alle Studierenden der Fakultät für
                  Informatik und Wirtschaftsinformatik der
                  <b> Fachschaft für Informatik und Wirtschaftsinformatik</b>,
                  kurz IWI, an.
                  <br />
                  <br />
                  Die <b>aktive Fachschaft</b> setzt sich allerdings nur aus
                  einem kleinen Kreis freiwilliger Helfer zusammen, die sich
                  <b> aktiv für die Interessen der Studierenden</b> in ihrem
                  Fachbereich einsetzen.
                </p>
              </div>

              <div>
                <img
                  className="rounded-xl lg:w-3/4 lg:float-right mx-auto md:mx-0"
                  src="/images/fs-iwi-gesamtbild.jpg"
                  alt="Fachschaft Gruppenbild"
                />
              </div>
            </div>

            <div className="col-span-3">
              <div className="grid grid-cols-1 gap-8 mb-8">
                <div className="col-span-1">
                  <h4>
                    Primärer Aufgabenbereich
                  </h4>
                </div>

                <div className="col-span-1">
                  <p>
                    Die Fachschaft ist für <b>alle Belange der Studierenden</b>{" "}
                    im Fachbereich Informatik und Wirtschaftsinformatik
                    zuständig. Wir stehen euch nicht nur als{" "}
                    <b>Ansprechpartner für studienbezogene Fragen</b> zur
                    Verfügung, sondern{" "}
                    <b>
                      organisieren die O-Phase und den Programmiervorkurs,
                      sammeln Klausuren
                    </b>{" "}
                    in unserer Cloud, <b>bieten Hilfe bei Problemen</b> zwischen
                    Studierenden und ProfessorInnen an und vieles mehr.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </ResponsiveWrapper>

      <div>
        <BoxFullWidthBlue
          title="Möchtest du mit dabei sein?"
          subtitle="Melde dich direkt bei uns vor Ort in der Fachschaft, per Email oder komm zur Fachschaftssitzung!"
          buttontext="Jetzt mitmachen"
          buttonlink="#mitmachen"
        />
      </div>

      <ResponsiveWrapper>
        <div className="max-w-screen-xl w-full md:m-auto flex flex-col-reverse md:flex-row">
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="petrol_pale_text mt-0">Vorstand & Fachschaft</h2>
            </div>

            <div className="col-span-1">
              <p>
                Die Rollen in der Fachschaft sind klar verteilt. Es gibt die
                Vorstandsebene und die Fachbereiche innerhalb der Fachschaft.
                Der Vorstand (1. & 2. Vorstand sowie 1. & 2. Finanzer) werden
                für ein Jahr laut Satzung zu Beginn jedes Wintersemesters
                gewählt.
              </p>
            </div>

            <div className="mb-12">
              {/* Vorstand */}
              <FsMitglieder mitglieder={members.slice(0, 4)} />
              {/* Ämter – die Fachbereiche folgen weiter unten im Abschnitt "Fachbereiche" */}
              <FsMitglieder mitglieder={members.slice(4, 8)} />
            </div>
          </div>
        </div>
      </ResponsiveWrapper>

      <ResponsiveWrapper>
        <div
          className="max-w-screen-xl w-full md:m-auto flex flex-col-reverse md:flex-row"
          id="fachbereiche"
        >
          <div className="flex flex-col justify-between mb-12">
            <div>
              <h2 className="petrol_pale_text mt-0">Fachbereiche</h2>
            </div>

            <div className="col-span-1">
              <p>
                Die inhaltliche Arbeit passiert in den Fachbereichen. Jeder
                Fachbereich hat eine <b>feste Ansprechperson</b> und einen klar
                abgegrenzten Aufgabenbereich. Bei Fachbereichen, die noch
                gesucht werden, freuen wir uns über deine Unterstützung.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
              {departments.map((fachbereich) => (
                <FachbereichBox key={fachbereich.position} fachbereich={fachbereich} />
              ))}
            </div>
          </div>
        </div>
      </ResponsiveWrapper>

      <ResponsiveWrapper>
        <div
          className="max-w-screen-xl w-full md:m-auto flex flex-col-reverse md:flex-row"
          id="mitmachen"
        >
          <div className="flex flex-col justify-between mb-12">
            <div>
              <h2 className="petrol_pale_text mt-0">Mitmachen</h2>
            </div>

            <div className="col-span-1">
              <p>
                Wir sind immer froh über <b>engagierte Helfer:innen</b>, die sich
                für die Studierenden des Fachbereichs einsetzen wollen. Welche
                und wie viele Aufgaben du übernimmst und wie viel Zeit du
                investierst, entscheidest du selbst: Ob du einfach nur an den
                Sitzungen teilnimmst oder dich aktiv um einen eigenen
                Aufgabenbereich kümmerst – du bist bei uns immer herzlich
                willkommen.
              </p>
              <p>
                Ein guter Anfang ist es, bei einer <b>Fachschaftssitzung</b>{" "}
                vorbeizuschauen. Hast du vorher noch Fragen oder Anregungen?
                Dann schreib uns eine Mail, klingel bei uns durch oder komm
                einfach in <b>Raum E013</b> vorbei.
              </p>
            </div>

            <InfoBox
              icon="exclamation"
              buttontext={strings.participate.online.title}
              buttonlink={strings.participate.online.url}
              buttonNewTab={true}
            >
              Aktuell finden die{" "}
              <b>Sitzungen sowohl online, als auch in Präsenz</b> statt. Wenn du
              Interesse hast, Teil der aktiven Fachschaft zu werden, komm
              einfach zur <b>Fachschaftssitzung</b>. Immer{" "}
              <b>mittwochs ab 11:30 Uhr im Raum E004</b> oder auf{" "}
              <a
                href={strings.participate.zoom.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                <b>Zoom</b>
              </a>
              .
            </InfoBox>

            <div className="mt-4">
              <Button
                type="large-blue1"
                text="Kontakt aufnehmen"
                url="/contact"
              />
            </div>
          </div>
        </div>
      </ResponsiveWrapper>

      <ResponsiveWrapper>
        <div
          className="max-w-screen-xl w-full md:m-auto flex flex-col-reverse md:flex-row"
          id="sitzungsprotokolle"
        >
          <div className="flex flex-col justify-between mb-12">
            <div>
              <h2 className="petrol_pale_text mt-0">Sitzungsprotokolle</h2>
            </div>
            <div className="col-span-1">
              <p>
                Die Protokollierung der Fachschaftssitzungen dient dazu,
                wichtige Themen und Abstimmungen für alle Studierenden
                transparent zugänglich zu machen. Wir bemühen uns jedes
                Protokoll zur Verfügung zu stellen.
              </p>
            </div>
            
            <Sitzungsprotokolle></Sitzungsprotokolle> 
            {/*
            Werden automatisch aus dem entsprechenden Ordner ausgelesen.
            Die entsprechende componente heißt sitzungsprotokoll-liste            
            */}

            {/*
            <div className="flex justify-center mt-6">
              <Button
                type="large-blue1"
                text="mehr laden"
                url="#" // Link muss ergänzt werden
              />
            </div>
            */}

          </div>
        </div>
      </ResponsiveWrapper>

      <ResponsiveWrapper>
        <div
          className="max-w-screen-xl w-full md:m-auto flex flex-col-reverse md:flex-row"
          id="fachschaftsordnung"
        >
          <div className="flex flex-col justify-between w-full">
            <div>
              <h2 className="petrol_pale_text mt-0">Fachschaftsordnung</h2>
            </div>

            <div className="col-span-1">
              <p>
                Jede Fachschaft verfügt über eine Fachschaftsordnung, die für
                ihre Arbeit von grundlegender Bedeutung ist.
              </p>
            </div>

            <ProtokollBox
              buttontext="Herunterladen"
              buttonlink="/assets/downloads/fachschaftsordnung-iwi.pdf"
              buttonNewTab={true} 
              subtext="Fassung vom 21. April 2021"
            >
              Fachschaftsordnung Informatik und Wirtschaftsinformatik
            </ProtokollBox>
          </div>
        </div>
      </ResponsiveWrapper>
    </>
  );
}

export default Index;

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      data: {
        title: "Fachschaft",
      },
    },
  };
};
