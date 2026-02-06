import { GetStaticProps } from "next";
import Obfuscate from "react-obfuscate";
import Icon from "@mdi/react";
import { mdiBookEducationOutline, mdiConsoleNetworkOutline } from "@mdi/js";

import ButtonButBigger from "../components/common/button-but-bigger";
import BoxTextImg from "../components/common/box-text-img";
import Header from "../components/common/header";
import InfoBox from "../components/common/infobox";
import ResponsiveWrapper from "../components/common/responsive-wrapper";
import BoxTextButton from "../components/common/box-text-button";


function Index() {
  return (
    <>
      <Header
        title="Informationen für Erstsemester"
        subtitle="Du bist neue(r) Student(in), also Ersti, der Fakultät IWI? Dann bist du hier goldrichtig. Wir haben dir alle wichtigen Infos zu deinen ersten Tagen an der Hochschule zusammengestellt."
      ></Header>

      <ResponsiveWrapper>
        {" "}
        <div className="max-w-screen-xl w-full md:m-auto flex flex-col-reverse md:flex-row">
          <div className="flex flex-col justify-between">
            <div>
              <h2>
                Allgemeine Informationen
              </h2>
              <InfoBox icon="exclamation">
                Um euch den Einstieg ins Studium zu erleichtern, unterstützen
                wir euch Erstis bereits vor Beginn der Vorlesungen. Darüber
                hinaus gibt es eine Orientierungsphase für euch, die am Montag
                in der ersten Vorlesungswoche startet."
              </InfoBox>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                <BoxWithIcon icon={mdiConsoleNetworkOutline}>
                  Zum einen bieten wir einen <b>Programmiervorkurs</b> an, in
                  dem ihr euch mit den Programmiersprachen{" "}
                  <ul>
                    <li>
                      <b>Java</b>, <b>C++</b> und <b>Python</b>
                    </li>
                  </ul>{" "}
                  vertraut machen könnt. Dieser Kurs findet{" "}
                  <b>zwei Wochen vor Vorlesungsbeginn</b> statt.
                </BoxWithIcon>

                <BoxWithIcon icon={mdiBookEducationOutline}>
                  Zusätzlich stellen wir ein Ersti-Heft zur Verfügung, das jedes
                  Semester aktualisiert und überarbeitet wird.{" "}
                  <b>
                    Das zugehörige Passwort erhältst du während der O-Phase.
                  </b>{" "}
                  Um das Studium besser zu verstehen, gibt es während der
                  Orientierungsphase ein{" "}
                  <b>Briefing zur Prüfungsordnung (PO)</b>.
                </BoxWithIcon>
              </div>


              <h2>
                Wichtige Links und Dokumente
              </h2>
              <h4 className="petrol_pale_text mt-0 mb-4">O-Phase</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <ButtonButBigger bgcolor="petrol" text={"Programmiervorkurs"} link={"/Programmiervorkurs/"} newTab={true}></ButtonButBigger>
                <ButtonButBigger bgcolor="petrol" text={"Ersti-Heft"} link={"/assets/downloads/ophase/erstiheft/Erstiheft_SS25.pdf"} newTab={true}></ButtonButBigger>
                <ButtonButBigger bgcolor="petrol" text={"O-Phasen-Programm"} link={"/O-Phase"} newTab={true}></ButtonButBigger> {/* Link fehlt */}
              </div>

              <h4 className="petrol_pale_text mt-0 mb-0"> Studien- und Prüfungsordnung (SPO)</h4>
              <p className="mb-4">Letzter Stand der Aktualisierung: 13.08.2025</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <ButtonButBigger
                  bgcolor="petrol"
                  text={"SPO INFB"}
                  subtext="V8 (gültig ab 01.09.2024)"
                  link={"/assets/downloads/ophase/spo/HKA_FK-IWI_INFB-SPO_V8_2024-09-01.pdf"}
                  newTab={true}
                ></ButtonButBigger>
                <ButtonButBigger
                  bgcolor="petrol"
                  text={"SPO MINB"}
                  subtext="V6 (gültig ab 01.09.2024)"
                  link={"/assets/downloads/ophase/spo/HKA_FK-IWI_MINB-SPO_V6_2024-09-01.pdf"}
                  newTab={true}
                ></ButtonButBigger>
                <ButtonButBigger
                  bgcolor="petrol"
                  text={"SPO DSCB"}
                  subtext="V1 (gültig ab 01.09.2020)"
                  link={"/assets/downloads/ophase/spo/HKA_FK-IWI_DSCB_SPO_V1_2020-09-01.pdf"}
                  newTab={true}
                ></ButtonButBigger>
                <ButtonButBigger
                  bgcolor="petrol"
                  text={"SPO IIBB"}
                  subtext="V2 (gültig ab 01.09.2024)"
                  link={"/assets/downloads/ophase/spo/HKA_FK-IWI_IIBB-SPO_V2_2024-09-01.pdf"}
                  newTab={true}
                ></ButtonButBigger>
                <ButtonButBigger
                  bgcolor="petrol"
                  text={"SPO WIIB"}
                  subtext="V7 (gültig ab 01.09.2024)"
                  link={"/assets/downloads/ophase/spo/HKA_FK-IWI_WIIB-SPO_V7_2024-09-01.pdf"}
                  newTab={true}
                ></ButtonButBigger>
                <ButtonButBigger
                  bgcolor="petrol"
                  text={"SPO INFM"}
                  subtext="V8 (gültig ab 01.09.2024)"
                  link={"/assets/downloads/ophase/spo/HKA_FK-IWI_INFM-SPO_V8_2024-09-01_01.pdf"}
                  newTab={true}
                ></ButtonButBigger>
                <ButtonButBigger
                  bgcolor="petrol"
                  text={"SPO WIIM"}
                  subtext="V8 (gültig ab 01.09.2024)"
                  link={"/assets/downloads/ophase/spo/HKA_FK-IWI_WIIM-SPO_V8_2024-09-01.pdf"}
                  newTab={true}
                ></ButtonButBigger>
                <ButtonButBigger
                  bgcolor="red"
                  text={"alle SPO's"}
                  link={"https://www.h-ka.de/studieren/studium-organisieren/studienordnungen-satzungen/studien-und-pruefungsordnungen"}
                  newTab={true}
                ></ButtonButBigger>
              </div>
              <h4 className="petrol_pale_text mt-0 mb-4">Studium</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-20 md:mb-24">
                <ButtonButBigger
                  bgcolor="petrol"
                  text={"Informationen zur Immatrikulation"}
                  link={"https://www.h-ka.de/studieren/studium-organisieren/einstieg-ins-studium/immatrikulationsinfos-ansprechpartner"}
                  newTab={true}
                ></ButtonButBigger>
                <ButtonButBigger
                  bgcolor="petrol"
                  text={"StudiBoard"}
                  newTab={true}
                  link={
                    "https://cloud.iwi-hka.de/login?redirect_url=/apps/files/files/525?dir%3D/StudiBoard"
                  }
                ></ButtonButBigger>
                <ButtonButBigger
                  bgcolor="petrol"
                  text={"Semestertermine der HKA"}
                  link={
                    "https://www.h-ka.de/die-hochschule-karlsruhe/aktuelles/termine/semestertermine"
                  }
                  newTab={true}
                ></ButtonButBigger>
                <ButtonButBigger 
                  bgcolor="petrol" 
                  text={"RZ-Einführung"} 
                  link={"/assets/downloads/rz_einfuehrung_wi_dsc_iib_ss_2023.pdf"} 
                  newTab={true}>
                </ButtonButBigger>
              </div>
              <h2 className="petrol_pale_text mt-0 mb-4">
                Orientierungs-Phase (= O-Phase)
              </h2>
              {/*
              <div className="relative w-full invisible md:visible">
                <img
                  className="absolute bottom-6 w-36 right-0"
                  src="/images/Shape-3.svg"
                ></img>
              </div>
              */}
              
              <InfoBox icon={"exclamation"}>
                Die O-Phase im Wintersemester 24/2025 beginnt am 30.09.2024 und
                endet am 04.10.2024. Ab dem 07.10.2024 sind regulär Vorlesungen!
                Schaut bitte in euren Stundenplan. Übungen und Labore beginnen
                ab der 2. Vorlesungswoche (mit Ausnahmen).
              </InfoBox>

              <div className="flex flex-col gap-12 mb-12 mt-12">
                <BoxTextImg
                  imageSrc="/images/news/demo_beer.jpg"
                  imageAlt="O-Phase Team"
                  overlay={true}
                >
                  <h4 className="petrol_pale_text mt-0 mb-4">Wer organisiert die O-Phase?</h4>
                  <p>
                    Organisiert werden die Veranstaltungen vor und in der ersten Woche
                    von der Hochschule bzw. Fakultät und von der Fachschaft Informatik
                    und Wirtschaftsinformatik (das sind wir).
                  </p>
                </BoxTextImg>

                <BoxTextImg
                  imageSrc="/images/news/demo_party.png"
                  imageAlt="O-Phase Team"
                  overlay = {true}
             
                >
                  <h4 className="petrol_pale_text mt-0 mb-4">Wer darf teilnehmen?</h4>
                  <p>
                    Die O-Phase richtet sich an alle Studenten der Bachelor Studiengänge: <br />
                    <b>
                      Informatik, Medieninformatik, Wirtschaftsinformatik, Internationales
                      IT Business und Data Science
                    </b>
                    <br /> <br />
                    Ebenso für die Master Studiengänge: <br />
                    <b>Informatik und Wirtschaftsinformatik</b>
                  </p>
                </BoxTextImg>
              </div>



              <BoxTextButton
                heading="O-Phasen-Programm"
                text={
                  <>
                    Da innerhalb der Fakultät Informatik und
                    Wirtschaftsinformatik{" "}
                    <b>verschiedene Programme in der O-Phase</b> angeboten
                    werden, sind <b>zwei Programmübersichten</b> zu sehen.
                    Gegebenenfalls kann es auch innerhalb eines Zeitplans
                    verschiedene Zeitstränge geben, achtet hier auf die
                    betroffene Gruppe.
                    <br />
                    <br />
                    Beachte bitte, dass sich die genaueren Planungen kurzfristig
                    ändern können. Es lohnt sich regelmäßig vorbeizuschauen.
                    <b>
                      {" "}
                      Über Änderungen während der O-Phase versuchen wir euch
                      rechtzeitig zu informieren.
                    </b>
                  </>
                }
                boxText="O-Phasen-Programm"
                boxLink="/O-Phase"
                newTab={true}
                note={
                  <>
                    <b>Hinweis:</b> TBA bedeutet to be announced
                  </>
                } 
              />
              
              <div className="text-xl mb-20"></div> {/*Abstand*/}

              <h2>Studiboard</h2>
              <BoxTextButton
                text={
                  <>
                    Wir betreiben eine Cloud, die{" "}
                    <b>wichtige Informationen zum Studium</b> bereitstellt und
                    natürlich <b>Altklausuren</b> verwaltet. Hierzu werden{" "}
                    <b>RZ Zugangsdaten benötigt</b>.
                    <br />
                    <br />
                    Im Ordner "Allgemeines" findet man auch{" "}
                    <b>diverse Signalgruppen aus den vorherigen Semestern</b>,
                    falls jemand aufgrund eines Hochschulwechsels im höheren
                    Semester beginnt.
                  </>
                }
                boxText="StudiBoard"
                newTab={true}
                boxLink="https://cloud.iwi-hka.de/login?redirect_url=/apps/files/files/525?dir%3D/StudiBoard"
              />

              <InfoBox icon={"exclamation"}>
                Sollte die <b>Registrierung</b> fehlschlagen, bitten wir dich
                uns eine Email mit deinem <b>RZ Kürzel</b> und deiner{" "}
                <b>Hochschulemail</b> an folgende Email zu senden:{" "}
                <Obfuscate email="kontakt@hka.iwi.de"></Obfuscate>
              </InfoBox>

              <div className="text-xl mb-20"></div> {/*Abstand*/}

              <h2>RZ-Kennung / Fragen?</h2>
              <InfoBox icon={"exclamation"}>
                Habt ihr Probleme mit eurer RZ Kennung und könnt euch nicht
                anmelden? Dann meldet euch beim RZ: <br />
                Montag - Freitag: 08:00 - 14:00 Uhr | Gebäude LI, Raum 135,
                Moltkestr. 30, 76133 Karlsruhe
              </InfoBox>
              <p className="primary_grey">
                Wenn ihr Fragen oder Probleme habt, meldet euch einfach in der
                Signal-Gruppe oder schreibt eine Mail:{" "}
                <Obfuscate email="kontakt@hka.iwi.de"></Obfuscate>
              </p>
            </div>
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
        title: "Erstsemester",
      },
    },
  };
};

function BoxWithIcon({ icon, children }) {
  return (
    <div className="flex justify gap-4">
      <div className="w-auto">
        <Icon color="var(--primary_blue)" path={icon} size={2.5} />
      </div>
      <div className="primary_grey">{children}</div>
    </div>
  );
}

