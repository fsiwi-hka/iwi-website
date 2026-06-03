import { GetStaticProps } from "next";
import { mdiAccount, mdiEmailFast } from "@mdi/js";

import Carousel from "../components/common/carousel";
import ContactBox from "../components/common/contact-box";
import CooperationBox from "../components/common/cooperationBox";
import Header from "../components/common/header";
import InfoBox from "../components/common/infobox";
import PackageBox from "../components/common/package-box";
import ResponsiveWrapper from "../components/common/responsive-wrapper";


const contacts = [
  {
    title: "",
    contactLists: [
      {
        title: "Sie erreichen uns per Email",
        contactItems: [
          {
            imageSrc: mdiEmailFast,
            items: ["kontakt@iwi-hka.de"],
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
            items: ["Denis Lischer"],
          },
          {
            imageSrc: mdiAccount,
            items: ["Dustin Sommerfeld  "],
          },
        ],
      },
    ],
    direction: "vertical",
  },
];

interface CooperationsBox {
  companyLogo: string;
  description: string;
  link: string;
}

const cooperations = [
  {
    companyLogo: "/images/unternehmen/gameforge.png",
    description:
      "Gameforge ist ein Anbieter von Online-Spielen. Die international tätige Unternehmensgruppe mit Hauptsitz in Karlsruhe vertreibt 13 Spiele in über 75 Ländern und hat über 450 Millionen registrierte Spieler.",
    link: "https://gameforge.com/de-DE/",
  },
  {
    companyLogo: "/images/unternehmen/exxeta.png",
    description:
      "Exxeta steht für die einzigartige Verbindung von Business und IT mit Schwerpunkt in den Branchen Automotive, Energy und Financial Services.",
    link: "https://exxeta.com/",
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


export interface CarouselImage {
  url: string;
  size: number;
}

const carouselImages: CarouselImage[] = [
  {
    url: "/images/unternehmen/arconsis.png",
    size: 140,
  },
  {
    url: "/images/unternehmen/cas.png",
    size: 60,
  },
  {
    url: "/images/unternehmen/init.png",
    size: 80,
  },
  {
    url: "/images/unternehmen/dmtech.jpg",
    size: 50,
  },
  {
    url: "/images/unternehmen/exxeta.png",
    size: 120,
  },
  {
    url: "/images/unternehmen/amiconsult.png",
    size: 180,
  },
  {
    url: "/images/unternehmen/bee360.png",
    size: 100,
  },
  {
    url: "/images/unternehmen/bockaufkarlsruhe.png",
    size: 80,
  },
  {
    url: "/images/unternehmen/cyberforum.png",
    size: 110,
  },
  {
    url: "/images/unternehmen/essentri.png",
    size: 130,
  },
  {
    url: "/images/unternehmen/gameforge.png",
    size: 150,
  },
  {
    url: "/images/unternehmen/interflex.png",
    size: 140,
  },
  {
    url: "/images/unternehmen/it-economics.png",
    size: 180,
  },
  {
    url: "/images/unternehmen/karlsruhedigital.png",
    size: 170,
  },
  {
    url: "/images/unternehmen/KJW_Karlsruhe.png",
    size: 100,
  },
  {
    url: "/images/unternehmen/letsdev.png",
    size: 80,
  },
  {
    url: "/images/unternehmen/notebuddys.png",
    size: 120,
  },
  {
    url: "/images/unternehmen/moninger.png",
    size: 100,
  },
  {
    url: "/images/unternehmen/pizza_lorenzo.png",
    size: 120,
  },
  {
    url: "/images/unternehmen/sovendus.png",
    size: 160,
  },
  {
    url: "/images/unternehmen/utb.png",
    size: 100,
  },
  {
    url: "/images/unternehmen/wg-held.png",
    size: 120,
  },
];

function Index() {
  return (
    <>
      <Header
        title="Recruiting durch Sponsoring"
        subtitle="Werden Sie Sponsor oder Kooperationspartner der Fachschaft IWI – Vernetzen Sie sich mit talentierten Studierenden und sichern Sie sich Ihre zukünftigen Fachkräfte!"
      ></Header>
      <ResponsiveWrapper>
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            <h2>Partner Programm</h2>
            <p>
              Wir pflegen viele Partnerschaften mit Unternehmen in der Region,
              nicht zuletzt durch Alumni, die der Fachschaft über das Studium
              hinaus treu bleiben. Auch Sie möchten mit der Fachschaft
              zusammenarbeiten? Sehr Gerne!
            </p>
            <p>
              Wir bieten Ihnen in unserem Partner-Programm vier
              Kooperations-Bausteine an, die Sie einzeln oder in Kombination
              umsetzen können:
            </p>
            <ul className={"text-[#6C6C6C]"}>
              <li>
                O-Phasen-Unterstützung (dies ist i.d.R. der Einstieg in eine
                Partnerschaft)
              </li>
              <li>Kooperation</li>
              <li>Kaminabend</li>
              <li>Spende</li>
            </ul>
            <p>
              Mehr zu den einzelnen Bausteinen erfahren Sie auf dieser Seite.{" "}
              <br />
              Wir freuen uns auf Ihre Nachricht!
            </p>
          </div>

          <div className={"flex flex-col gap-10 mt-auto"}>
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
      </ResponsiveWrapper>

      <ResponsiveWrapper>
        <Carousel images={carouselImages} speed={50} />
      </ResponsiveWrapper>

      <ResponsiveWrapper>
        <div>
          <h2>O-Phasen Unterstützung</h2>
          <InfoBox icon={"heart"}>
            Dank unserer Sponsoren können sich die Erstsemesterstudierenden auf
            eine prall gefüllte Erstitasche freuen. Hiermit bedanken wir uns
            recht herzlich bei allen Sponsoren, die dies jedes Semester aufs
            Neue möglich machen!
          </InfoBox>
          <h4>O-Phasen-Supporter werden</h4>
          <p>
            Auch Sie können uns bei der Orientierungsphase unterstützen, die zum
            Beginn jedes Semesters durchgeführt wird. Dabei gibt es verschiedene
            Abstufungen:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

          <h4 className="mb-4">Mehr Reichweite durch Social Media</h4>
          <InfoBox icon={"exclamation"}>
            Wenn Sie einen Social-Media-Account auf Instagram betreiben, besteht
            zusätzlich die Möglichkeit, dass wir Sie in einem zentralen
            Erstitüten-Post taggen.
          </InfoBox>

          <h2 className="mt-20">Kooperation</h2>
          <p>
            Sind Sie an einer <b>einmaligen oder langfristigen Kooperation</b>{" "}
            interessiert, sind Sie hier richtig.
          </p>
          <p>
            Diese Art der Partnerschaft ist vielseitig denkbar und hängt stark
            davon ab, wie Sie sich präsentieren möchten. Denkbar sind
            beispielsweise:
          </p>
          <ul className="pl-4">
            <li>
              Die Übernahme einer Getränkelieferung pro Semester (mit
              gebrandeten Etiketten)
            </li>
            <li>
              Die einmalige Finanzierung von Drucksachen (Hoodies, T-Shirts,
              etc.) für die Fachschaft - mit Ihrem Logo
            </li>
            <li>Sachwerte, wie ein Kicker für den Fachschaftsraum</li>
          </ul>
          <p>
            Kommen Sie hier auch gerne mit Ihren eigenen Ideen auf uns zu, wir
            freuen uns!
          </p>

          <h4 className="mb-4 mt-12">Aktuelle Kooperationen</h4>
          <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-3 mb-12 ">
            {cooperations.map(
              (cooperationsElem: CooperationsBox, index: number) => (
                <CooperationBox
                  key={index}
                  logo={cooperationsElem.companyLogo}
                  description={cooperationsElem.description}
                  link={cooperationsElem.link}
                />
              )
            )}
          </div>

          <h2 className="mt-20">Kaminabend</h2>
          <p className={"py-2"}>
            Im Rahmen dieses Bausteins organisieren Sie{" "}
            <b>in Zusammenarbeit mit uns</b> einen Kaminabend, zu dem wir die
            IWI-Studierendenschaft einladen. Dabei stehen{" "}
            <b>fachliche Themen im Fokus</b>, und Ihre EntwicklerInnen oder
            ProjektmanagerInnen berichten aus dem <b>Arbeitsalltag</b>. Die
            Veranstaltung lebt vom Dialog, und oft ergeben sich aus Fragen der
            Studierenden spannende Diskussionen. Das <b>Networking</b> steht
            natürlich ebenso im Zentrum, und Informationen zu Praktika oder
            Einstiegspositionen nach dem Studium können eingebaut werden. Findet
            die Veranstaltung vor Ort statt, geht der Kaminabend damit einher,
            dass Sie ein Catering (i. d. R. Pizza) anbieten und (falls möglich)
            auch die Location stellen.
          </p>

          <h4>Impressionen von vergangenen Kaminabenden</h4>
          <div
            className={
              "flex flex-col lg:flex-row lg:justify-between gap-10 py-10"
            }
          >
            <img
              src={"/images/events/kaminabend/kaminabend1.png"}
              alt={"kamindabend"}
              className={"rounded-lg w-full lg:w-1/5"}
            />
            <img
              src={"/images/events/kaminabend/kaminabend2.png"}
              alt={"kamindabend"}
              className={"rounded-lg w-full lg:w-1/5"}
            />
            <img
              src={"/images/events/kaminabend/kaminabend3.png"}
              alt={"kamindabend"}
              className={"rounded-lg w-full lg:w-1/5"}
            />
            <img
              src={"/images/events/kaminabend/kaminabend4.png"}
              alt={"kamindabend"}
              className={"rounded-lg w-full lg:w-1/5"}
            />
          </div>

          <h2 className="mt-20">Spenden</h2>
          <p>
            Jederzeit haben Sie zusätzlich natürlich auch die Möglichkeit, uns
            finanziell mit einer Spende zu unterstützen. Diese Spende erfolgt
            ohne Gegenleistung und wir können Ihnen eine entsprechende
            Spendenquittung ausstellen.
          </p>
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
