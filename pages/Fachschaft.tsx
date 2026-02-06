import { GetStaticProps } from "next";

import BoxFullWidthBlue from "../components/common/box-full-width-blue";
import FsMitglieder from "../components/common/fs-mitglieder";
import Header from "../components/common/header";
import InfoBox from "../components/common/infobox";
import ProtokollBox from "../components/common/protokollbox";
import ResponsiveWrapper from "../components/common/responsive-wrapper";
import Sitzungsprotokolle from "../components/common/sitzungsprotokolle-list";

// Auflistung der Mitglieder unter "Vorstand & Fachschaft"
const mitgliederDaten = [
  {
    img: "/images/fachschaft/dustin_sommerfeld.jpg",
    position: "1. Vorstand",
    name: "Dustin Sommerfeld",
  },
  {
    img: "/images/fachschaft/guelnur_kanar.jpg",
    position: "2. Vorstand",
    name: "Gülnur Kanar",
  },
  {
    img: "/images/fachschaft/ioannis_theodosiadis.jpg",
    position: "1. Finanzer",
    name: "Ioannis Theodosiadis",
  },
  {
    img: "/images/fachschaft/placeholder.jpg",
    position: "2. Finanzer",
    name: "Bastian Knebel",
  },
  {
    img: "/images/fachschaft/alex_besch.jpg",
    position: "Protokollant:in",
    name: "Alex Besch",
  },
  {
    img: "/images/fachschaft/dustin_sommerfeld.jpg",
    position: "Mail Manager:in",
    name: "Dustin Sommerfeld",
  },
  {
    img: "/images/fachschaft/placeholder.jpg",
    position: "Kaffee Manager:in",
    name: "Denis Lischer",
  },
  {
    img: "/images/fachschaft/placeholder.jpg",
    position: "Förderverein",
    name: "Simon Parker",
  },
  {
    img: "/images/fachschaft/ioannis_theodosiadis.jpg",
    position: "FB Finanzen",
    name: "Ioannis Theodosiadis",
  },
  {
    img: "/images/fachschaft/placeholder_gesucht.jpg",
    position: "FB Events",
    name: "Wird gesucht!",
  },
  {
    img: "/images/fachschaft/placeholder.jpg",
    position: "FB Sponsoring",
    name: "Denis Lischer",
  },
  {
    img: "/images/fachschaft/david_flaig.jpg",
    position: "FB Infrastruktur",
    name: "David Flaig",
  },
  {
    img: "/images/fachschaft/florian_kaiser.jpg",
    position: "FB Marketing",
    name: "Florian Kaiser",
  },
  {
    img: "/images/fachschaft/placeholder.jpg",
    position: "FB O-Phase",
    name: "Lukas Hörnle",
  },
  {
    img: "/images/fachschaft/placeholder.jpg",
    position: "FB Fachschaftsraum",
    name: "Denis Lischer",
  },
];

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

            <InfoBox
              icon="exclamation"
              buttontext="Online Teilnehmen"
              buttonlink="https://h-ka-de.zoom-x.de/j/64304270469"
              buttonNewTab={true}
            >
              Aktuell finden die{" "}
              <b>Sitzungen sowohl online, als auch in Präsenz</b> statt. Wenn du
              Interesse hast, Teil der aktiven Fachschaft zu werden, komm
              einfach zur <b>Fachschaftssitzung</b>. Immer{" "}
              <b>mittwochs ab 11:30 Uhr im Raum E004</b> oder auf <b>Zoom</b>.
            </InfoBox>
            
          </div>
        </div>
      </ResponsiveWrapper>

      <div id="mitmachen">
        {" "}
        <BoxFullWidthBlue
          title="Möchtest du mit dabei sein?"
          subtitle="Melde dich direkt bei uns vor Ort in der Fachschaft, per Email oder komm zur Fachschaftssitzung!"
          buttontext="Jetzt mitmachen"
          buttonlink="../Mitmachen"
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
              <FsMitglieder mitglieder={mitgliederDaten.slice(0, 4)} />
              <FsMitglieder mitglieder={mitgliederDaten.slice(4, 9)} />
              <FsMitglieder mitglieder={mitgliederDaten.slice(9, 15)} />
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
