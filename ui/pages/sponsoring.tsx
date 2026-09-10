import { GetStaticProps } from "next";
import { useState } from "react";
import Icon from "@mdi/react";
import {
  mdiAccount,
  mdiArrowTopRight,
  mdiBankOutline,
  mdiCheck,
  mdiContentCopy,
  mdiEmailFast,
  mdiFireplace,
  mdiHandshakeOutline,
  mdiHeartOutline,
  mdiSchoolOutline,
} from "@mdi/js";

import Carousel from "../components/common/carousel";
import ContactBox from "../components/common/contact-box";
import CooperationBox from "../components/common/cooperationBox";
import Header from "../components/common/header";
import InfoBox from "../components/common/infobox";
import PackageBox from "../components/common/package-box";
import ResponsiveWrapper from "../components/common/responsive-wrapper";
import { sponsorLogos } from "../content/sponsors";
import {strings} from "@lib/strings";

// ---------------------------------------------------------------------------
// TODO: Von der Fachschaft bestätigen lassen! Die Platzhalter unten dürfen so
// NICHT online gehen – eine erfundene IBAN auf einer Spendenseite ist deutlich
// schlimmer als gar keine.
// ---------------------------------------------------------------------------
const foerderverein = {
  name: "Förderverein der Fachschaft IWI e. V.",
  accountHolder: "Förderverein der Fachschaft IWI e. V.",
  iban: "DE25 6619 0000 0096 0155 93",
  bic: "GENODE61KA1",
  contact: "Florian Kaiser", // Ansprechperson laut content/member.ts
};

const contacts = [
  {
    title: "",
    contactLists: [
      {
        title: "Sie erreichen uns per Email",
        contactItems: [
          {
            imageSrc: mdiEmailFast,
            items: [strings.sponsoring.mail],
          },
        ],
      },
    ],
    direction: "vertical",
  },
  {
    title: "",
    contactLists: [
      {
        title: "Ansprechpartner im Fachbereich Sponsoring",
        contactItems: [
          {
            imageSrc: mdiAccount,
            items: ["Luca Claus"],
          }
        ],
      },
    ],
    direction: "vertical",
  },
];

interface Baustein {
  icon: string;
  title: string;
  description: string;
  anchor: string;
}

const bausteine: Baustein[] = [
  {
    icon: mdiSchoolOutline,
    title: "O-Phase",
    description:
      "Der übliche Einstieg in eine Partnerschaft: Goodies, Anzeigen oder ein Stand bei der Ersti-Rallye.",
    anchor: "#o-phase",
  },
  {
    icon: mdiHandshakeOutline,
    title: "Kooperation",
    description:
      "Einmalig oder langfristig – von gebrandeten Getränken bis zum Kicker für den Fachschaftsraum.",
    anchor: "#kooperation",
  },
  {
    icon: mdiFireplace,
    title: "Kaminabend",
    description:
      "Ein Abend mit fachlichem Vortrag, Diskussion und Networking – bei Ihnen oder bei uns.",
    anchor: "#kaminabend",
  },
  {
    icon: mdiHeartOutline,
    title: "Spende",
    description:
      "Unterstützung ohne Gegenleistung – unkompliziert über unseren Förderverein.",
    anchor: "#spende",
  },
];

interface CooperationsBox {
  companyLogo: string;
  description: string;
  link: string;
}

const cooperations: CooperationsBox[] = [
  {
    companyLogo: "/images/unternehmen/gameforge.jpg",
    description:
      "Gameforge ist ein Anbieter von Online-Spielen. Die international tätige Unternehmensgruppe mit Hauptsitz in Karlsruhe vertreibt 13 Spiele in über 75 Ländern und hat über 450 Millionen registrierte Spieler.",
    link: "https://gameforge.com/de-DE/",
  },
  {
    companyLogo: "/images/unternehmen/init.png",
    description:
      "Die INIT GmbH ist ein deutsches Unternehmen für IT-Lösungen im öffentlichen Personenverkehr.",
    link: "https://www.initse.com/dede/home/",
  },
];

interface PackageBox {
  title: string;
  text: React.ReactNode;
  subtitle: string;
  services: string[];
}

const packages: PackageBox[] = [
  {
    title: "Paket S",
    text: (
      <p className="petrol_text">
        Sie tragen “Goodies” (<b>gebrandete Werbegeschenke</b> mit praktischem
        Nutzen) zu unserer Ersti-Tasche bei.{" "}
      </p>
    ),
    subtitle: "Leistungen",
    services: [
      "Ihr Logo im Ersti-Heft",
      "Ihr Logo auf unserer Website mit Backlink",
    ],
  },
  {
    title: "Paket M",
    text: (
      <p className="petrol_text">
        Sie tragen Goodies (<b>gebrandete Werbegeschenke</b>) bei. <br></br>
        Platzierung einer <b>halbseitigen Anzeige</b> im Ersti-Heft{" "}
      </p>
    ),
    subtitle: "Leistungen",
    services: [
      "Ihr Logo im Ersti-Heft",
      "Halbseitige Anzeige im Ersti-Heft",
      "Ihr Logo auf unserer Website mit Backlink",
    ],
  },
  {
    title: "Paket L",
    text: (
      <p className="petrol_text">
        Sie tragen Goodies (<b>gebrandete Werbegeschenke</b>) bei. <br></br>
        Platzierung einer <b>ganzseitigen Anzeige</b> im Ersti-Heft{" "}
      </p>
    ),
    subtitle: "Leistungen",
    services: [
      "Ihr Logo im Ersti-Heft",
      "Ganzseitige Anzeige im Ersti-Heft für maximale Sichtbarkeit",
      "Ihr Logo auf unserer Website mit Backlink",
    ],
  },
  {
    title: "Paket XL",
    text: (
      <p className="petrol_text">
        Sie tragen Goodies (<b>gebrandete Werbegeschenke</b>) bei. <br></br>
        Übernahme eines Standes bei der Ersti-Rallye oder ein anderes O-Phasen
        Event auf unserem Campus z.B. Frühstückscafé{" "}
      </p>
    ),
    subtitle: "Leistungen",
    services: [
      "Ihr Logo im Ersti-Heft",
      "Präsenz vor Ort auf unserem Campus",
      "Ihr Logo auf unserer Website mit Backlink",
    ],
  },
];

const kaminabendImages = [
  "/images/events/kaminabend/kaminabend1.png",
  "/images/events/kaminabend/kaminabend2.png",
  "/images/events/kaminabend/kaminabend3.png",
  "/images/events/kaminabend/kaminabend4.png",
];

function BausteinCard({ baustein }: { baustein: Baustein }) {
  return (
    <a
      href={baustein.anchor}
      className="group white_bg rounded-xl p-6 flex flex-col h-full transition duration-200 hover:shadow-lg"
    >
      <Icon
        path={baustein.icon}
        size={1.6}
        color="var(--primary_blue)"
        className="mb-4"
      />
      <h4 className="mb-2">{baustein.title}</h4>
      <p className="text-sm primary_grey mb-6 flex-grow">
        {baustein.description}
      </p>
      <span className="petrol_text font-medium text-sm inline-flex items-center gap-1">
        Mehr erfahren
        <Icon
          path={mdiArrowTopRight}
          size={0.6}
          className="group-hover:rotate-45 transition duration-300"
        />
      </span>
    </a>
  );
}

// Zeile der Kontoverbindung mit Kopier-Button. Die Zwischenablage ist nicht in
// jedem Kontext verfügbar (z. B. ohne HTTPS), deshalb steht der Wert immer auch
// als markierbarer Text da.
function BankRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Kein Zugriff auf die Zwischenablage – Nutzer kann den Text markieren
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-[#DFE4E6] last:border-b-0">
      <div className="flex flex-col">
        <span className="text-sm primary_grey">{label}</span>
        <span className="petrol_text font-medium hyphens-none break-all">
          {value}
        </span>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`${label} kopieren`}
        className="flex-shrink-0 p-2 rounded-full transition duration-200 hover:bg-[#DFE4E6]"
      >
        <Icon
          path={copied ? mdiCheck : mdiContentCopy}
          size={0.8}
          color="var(--primary_blue)"
        />
      </button>
    </div>
  );
}

function Index() {
  return (
    <>
      <Header
        title="Recruiting durch Sponsoring"
        subtitle="Werden Sie Sponsor oder Kooperationspartner der Fachschaft IWI – Vernetzen Sie sich mit talentierten Studierenden und sichern Sie sich Ihre zukünftigen Fachkräfte!"
      ></Header>

      <ResponsiveWrapper>
        <div className="w-full flex flex-col gap-12 mb-4">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1">
              <h2 className="mt-0">Partner Programm</h2>
              <p>
                Wir pflegen viele Partnerschaften mit Unternehmen in der Region,
                nicht zuletzt durch Alumni, die der Fachschaft über das Studium
                hinaus treu bleiben. Auch Sie möchten mit der Fachschaft
                zusammenarbeiten? Sehr gerne!
              </p>
              <p>
                Wir bieten Ihnen vier Kooperations-Bausteine an, die Sie einzeln
                oder in Kombination umsetzen können. Wir freuen uns auf Ihre
                Nachricht!
              </p>
            </div>

            <div className="flex flex-col gap-10 mt-auto">
              {contacts.map((contact, index) => (
                <ContactBox
                  key={index}
                  title={contact.title}
                  contactLists={contact.contactLists}
                  direction={"vertical"}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bausteine.map((baustein) => (
              <BausteinCard key={baustein.title} baustein={baustein} />
            ))}
          </div>
        </div>
      </ResponsiveWrapper>

      <ResponsiveWrapper>
        <Carousel images={sponsorLogos} speed={50} />
      </ResponsiveWrapper>

      <ResponsiveWrapper>
        <div className="w-full flex flex-col gap-16 mb-16">
          <div id="o-phase">
            <h2 className="mt-0">O-Phasen Unterstützung</h2>
            <InfoBox icon={"heart"}>
              Dank unserer Sponsoren können sich die Erstsemesterstudierenden
              auf eine prall gefüllte Erstitasche freuen. Hiermit bedanken wir
              uns recht herzlich bei allen Sponsoren, die dies jedes Semester
              aufs Neue möglich machen!
            </InfoBox>

            <h4 className="mt-8">O-Phasen-Supporter werden</h4>
            <p>
              Auch Sie können uns bei der Orientierungsphase unterstützen, die
              zum Beginn jedes Semesters durchgeführt wird. Dabei gibt es
              verschiedene Abstufungen:
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {packages.map((packageElem: PackageBox, index: number) => (
                <PackageBox
                  key={index}
                  title={packageElem.title}
                  subtitle={packageElem.subtitle}
                  color={index % 2 === 0 ? "petrol_pale_bg" : "primary_blue_bg"}
                  services={packageElem.services}
                >
                  {packageElem.text}
                </PackageBox>
              ))}
            </div>

            <InfoBox icon={"exclamation"}>
              Wenn Sie einen Social-Media-Account auf Instagram betreiben,
              besteht zusätzlich die Möglichkeit, dass wir Sie in einem zentralen
              Erstitüten-Post taggen.
            </InfoBox>
          </div>

          <div id="kooperation">
            <h2 className="mt-0">Kooperation</h2>
            <p>
              Sind Sie an einer <b>einmaligen oder langfristigen Kooperation</b>{" "}
              interessiert, sind Sie hier richtig. Diese Art der Partnerschaft
              ist vielseitig denkbar und hängt stark davon ab, wie Sie sich
              präsentieren möchten. Denkbar sind beispielsweise:
            </p>
            <ul className="pl-4">
              <li>
                Die Übernahme einer Getränkelieferung pro Semester (mit
                gebrandeten Etiketten)
              </li>
              <li>
                Die einmalige Finanzierung von Drucksachen (Hoodies, T-Shirts,
                etc.) für die Fachschaft – mit Ihrem Logo
              </li>
              <li>Sachwerte, wie ein Kicker für den Fachschaftsraum</li>
            </ul>
            <p>
              Kommen Sie hier auch gerne mit Ihren eigenen Ideen auf uns zu, wir
              freuen uns!
            </p>

            <h4 className="mt-8 mb-4">Aktuelle Kooperationen</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cooperations.map((cooperationsElem, index) => (
                <CooperationBox
                  key={index}
                  logo={cooperationsElem.companyLogo}
                  description={cooperationsElem.description}
                  link={cooperationsElem.link}
                />
              ))}
            </div>
          </div>

          <div id="kaminabend">
            <h2 className="mt-0">Kaminabend</h2>
            <p>
              Im Rahmen dieses Bausteins organisieren Sie{" "}
              <b>in Zusammenarbeit mit uns</b> einen Kaminabend, zu dem wir die
              IWI-Studierendenschaft einladen. Dabei stehen{" "}
              <b>fachliche Themen im Fokus</b>, und Ihre EntwicklerInnen oder
              ProjektmanagerInnen berichten aus dem <b>Arbeitsalltag</b>. Die
              Veranstaltung lebt vom Dialog, und oft ergeben sich aus Fragen der
              Studierenden spannende Diskussionen. Das <b>Networking</b> steht
              natürlich ebenso im Zentrum, und Informationen zu Praktika oder
              Einstiegspositionen nach dem Studium können eingebaut werden.
              Findet die Veranstaltung vor Ort statt, geht der Kaminabend damit
              einher, dass Sie ein Catering (i. d. R. Pizza) anbieten und (falls
              möglich) auch die Location stellen.
            </p>

            <h4 className="mt-8 mb-4">
              Impressionen von vergangenen Kaminabenden
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {kaminabendImages.map((image) => (
                <img
                  key={image}
                  src={image}
                  alt="Kaminabend"
                  className="rounded-lg w-full h-40 object-cover"
                />
              ))}
            </div>
          </div>

          <div id="foerderverein">
            <h2 className="mt-0">Unser Förderverein</h2>
            <InfoBox icon={"exclamation"}>
              Alle Pakete, Kooperationen und Spenden werden im Hintergrund über
              den <b>{foerderverein.name}</b> abgewickelt. Verträge und
              Rechnungen kommen also vom Verein, inhaltlich betreut Sie
              weiterhin die Fachschaft.
            </InfoBox>
            <p>
              Für Sie ändert das nichts am Ablauf: Sie sprechen mit dem
              Fachbereich Sponsoring, die Abwicklung übernimmt der Verein im
              Hintergrund. Ansprechperson für Vereinsangelegenheiten ist{" "}
              <b>{foerderverein.contact}</b>.
            </p>
          </div>

          <div id="spende">
            <h2 className="mt-0">Spende</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 petrol_pale_bg rounded-xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Icon path={mdiHeartOutline} size={1.2} color="#7ED1F2" />
                  <h4 className="text-white">Unterstützen ohne Gegenleistung</h4>
                </div>
                <p className="text-white opacity-80 mb-4">
                  Sie können uns jederzeit auch finanziell mit einer Spende
                  unterstützen. Diese erfolgt ohne Gegenleistung.
                </p>
                <p className="text-white opacity-80 mb-0">
                  Bei Fragen zu Ihrer Spende wenden Sie sich gerne an{" "}
                  <a
                    href={`mailto:${strings.sponsoring.mail}`}
                    className="text-white underline hyphens-none"
                  >
                    {strings.verein.mail}
                  </a>
                  .
                </p>
              </div>

              <div className="white_bg rounded-xl p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <Icon
                    path={mdiBankOutline}
                    size={1.2}
                    color="var(--primary_blue)"
                  />
                  <h4>Kontoverbindung</h4>
                </div>
                <div className="flex flex-col">
                  <BankRow
                    label="Kontoinhaber"
                    value={foerderverein.accountHolder}
                  />
                  <BankRow label="IBAN" value={foerderverein.iban} />
                  <BankRow label="BIC" value={foerderverein.bic} />
                </div>
              </div>
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
        title: "Sponsoring & Kooperation",
      },
    },
  };
};
