import { GetStaticProps } from "next";

import Button from "../components/common/button";
import Header from "../components/common/header";
import StudyCard from "../components/common/study-card";
import ResponsiveWrapper from "../components/common/responsive-wrapper";

interface Button {
  text: string;
  url: string;
  buttonNewTab?: boolean;
}

interface StudyCard {
  title: string;
  subtitle: string;
  listElements: string[];
  buttons: Button[];
}

const platforms: StudyCard[] = [
  {
    title: "HISinOne",
    subtitle: "",
    listElements: ["Campusverwaltung"],
    buttons: [
      {
        text: "Zum HISinOne",
        url: "https://hisinone.extern-hs-karlsruhe.de/qisserver/pages/cs/sys/portal/hisinoneStartPage.faces",
        buttonNewTab: true,
      },
    ],
  },
  {
    title: "Ilias",
    subtitle: "",
    listElements: ["Lernplattform"],
    buttons: [{ text: "Zum Ilias", url: "https://ilias.h-ka.de/", buttonNewTab: true }],
  },
  {
    title: "Webmail",
    subtitle: "",
    listElements: ["Zugang zu Hochschulmail"],
    buttons: [{ text: "Zur Webmail", url: "https://owa.h-ka.de/", buttonNewTab: true }],
  },
  {
    title: "HKA-APP",
    subtitle: "",
    listElements: ["Verschiedene Services"],
    buttons: [
      {
        text: "Zur HKA-App",
        url: "https://www.h-ka.de/hka-app",
        buttonNewTab: true,
      },
    ],
  },
  {
    title: "Mattermost",
    subtitle: "",
    listElements: ["Chatplattform"],
    buttons: [
      {
        text: "Zu Mattermost",
        url: "https://mattermost.hska-iwi.de",
        buttonNewTab: true,
      },
    ],
  },
  {
    title: "Raumzeit",
    subtitle: "",
    listElements: ["Stundenpläne"],
    buttons: [
      {
        text: "Zu Raumzeit",
        url: "https://raumzeit.hka-iwi.de/",
        buttonNewTab: true,
      },
    ],
  },
  {
    title: "Intranet (INFB, INFM, MINB)",
    subtitle: "",
    listElements: ["Campusverwaltung"],
    buttons: [
      {
        text: "Zum HISinOne",
        url: "https://hisinone.extern-hs-karlsruhe.de/qisserver/pages/cs/sys/portal/hisinoneStartPage.faces",
        buttonNewTab: true,
      },
    ],
  },
  {
    title: "Intranet (WIIB, WIIM, IIBB, DSCB)",
    subtitle: "",
    listElements: ["Internes Tool"],
    buttons: [{ text: "Zum Intranet", url: "https://intranet.hka-iwi.de/", buttonNewTab: true }],

  },
  {
    title: "QIS",
    subtitle: "",
    listElements: ["Prüfungsverwaltung"],
    buttons: [
      {
        text: "Zum QIS",
        url: "https://qis-extern.hs-karlsruhe.de",
        buttonNewTab: true,
      },
    ],
  },
  {
    title: "Öffnungszeiten der Gebäude",
    subtitle: "",
    listElements: ["Öffnungszeiten und Service-Bereiche"],
    buttons: [
      {
        text: "Zur Website",
        url: "https://www.h-ka.de/oeffnungszeiten",
        buttonNewTab: true,
      },
    ],
  },
];

const literature: StudyCard[] = [
  {
    title: "Springer Link",
    subtitle: "",
    listElements: ["Login via: Shibboleth"],
    buttons: [
      {
        text: "Zur Anmeldung",
        url: "https://link.springer.com/",
        buttonNewTab: true,
      },
    ],
  },
  {
    title: "Herdt Campus",
    subtitle: "",
    listElements: ["Login via: Hochschulnetz"],
    buttons: [
      {
        text: "Zur Anmeldung",
        url: "https://herdt.com/campus/",
        buttonNewTab: true,
      },
    ],
  },
  {
    title: "Statista",
    subtitle: "",
    listElements: ["Login via: Hochschulnetz & Shibboleth"],
    buttons: [
      {
        text: "Zur Anmeldung",
        url: "https://de.statista.com",
        buttonNewTab: true,
      },
    ],
  },
  {
    title: "Beck-online",
    subtitle: "",
    listElements: ["Login via: Hochschulnetz"],
    buttons: [
      {
        text: "Zur Anmeldung",
        url: "https://beck-online.beck.de/Home",
        buttonNewTab: true,
      },
    ],
  },
  {
    title: "Ieexplore",
    subtitle: "",
    listElements: ["Login via: Shibboleth"],
    buttons: [
      {
        text: "Zur Anmeldung",
        url: "https://ieeexplore.ieee.org/",
        buttonNewTab: true,
      },
    ],
  },
  {
    title: "Emerald Insight",
    subtitle: "",
    listElements: ["Login via: Shibboleth"],
    buttons: [
      {
        text: "Zur Anmeldung",
        url: "https://www.emerald.com/insight/",
        buttonNewTab: true,
      },
    ],
  },
];

const softwares: StudyCard[] = [
  {
    title: "Microsoft Office 365",
    subtitle: "Word, Excel, PowerPoint, OneNote und vieles mehr. Lizenz gilt für bis zu 5 Desktop und 5 Mobile Geräte.",
    listElements: ["Registrieren via: Shibboleth", "Kosten: 4,39 € pro Jahr"],
    buttons: [
      {
        text: "Zur Registrierung",
        url: "https://bildung365.de",
        buttonNewTab: true,
      },
    ],
  },
  {
    title: "Windows 10/11",
    subtitle: "Windows Education Lizenz zum persönlichen Gebrauch.",
    listElements: ["Login via: Shibboleth"],
    buttons: [{ text: "Zur Anmeldung", url: "https://bildung365.de/", buttonNewTab: true }],
  },
  {
    title: "Jetbrains IDE",
    subtitle: "Lizenz für alle alle Tools von Jetbrains (nicht nur die Community Editions)..",
    listElements: ["Registrierung via: Hochschulmail (ggf. hs-karlsruhe.de)"],
    buttons: [
      {
        text: "Zur Registrierung",
        url: "https://www.jetbrains.com/",
        buttonNewTab: true,
      },
    ],
  },
  {
    title: "GitHub Student Developer Pack (GitHub Pro)",
    subtitle: "",
    listElements: ["Registrierung via: Hochschulmail"],
    buttons: [
      {
        text: "Mehr Infos",
        url: "https://education.github.com/pack",
        buttonNewTab: true,
      },
      { text: "Zur Registrierung", url: "https://github.com/education/students", buttonNewTab: true },
    ],
  },
  {
    title: "Microsoft Azure Dev Tools",
    subtitle: "",
    listElements: ["Registrierung via: Hochschulmail & Mircosoft Konto"],
    buttons: [
      {
        text: "Zur Registrierung",
        url: "https://azureforeducation.microsoft.com/devtools",
        buttonNewTab: true,
      },
    ],
  },
];

const clouds: StudyCard[] = [
  {
    title: "BW SYNC&SHARE",
    subtitle:
      "Eine vom KIT gehostete Nextcloud Instanz mit 50GB Speicher für jeden Student. Kann über die offiziellen Nextcloud-Clients auf allen bekannten Plattformen eingebunden werden. Funktionen: Dateien ablegen, teilen, anfordern, usw.",
    listElements: ["Login via: Shibboleth"],
    buttons: [
      {
        text: "Zur Registrierung",
        url: "https://bwsyncandshare.kit.edu/apps/user/_saml/saml/selectUserBackEnd?redirectUrl=",
        buttonNewTab: true,
      },
    ],
  },
  {
    title: "BW SYNC&SHARE",
    subtitle:
      "Infrastructure as a Service (IaaS) Angebot. Standardmäßig maximale Ressourcen: 4 Cloudserver (mit je 10 GB Speicher), 4 CPUs, 8 GB RAM, 4 extra Datenträger (insg. max. 50 GB), öffentliche IPv4 Adresse je Server. Alle großen Linux-Distributionen stehen als Abbild zur Verfügung, weitere können manuell hinzugefügt werden.",
    listElements: ["Login via: Shibboleth"],
    buttons: [
      {
        text: "Mehr Infos",
        url: "https://www.bw-cloud.org/",
        buttonNewTab: true,
      },
      { text: "Zur Registrierung", url: "https://login.bwidm.de/welcome/index.xhtml", buttonNewTab: true },
      { text: "Anmeldeportal", url: "https://portal.bw-cloud.org/auth/login/?next=/", buttonNewTab: true },
    ],
  },
  {
    title: "Gigamove",
    subtitle:
      "Bis zu 100GB große Dateien mit einer Gesamtgröße von maximal 1000GB für bis zu 14 Tage bereitstellen oder empfangen.",
    listElements: ["Login via: Shibboleth"],
    buttons: [{ text: "Zur Registrierung", url: "https://gigamove.rwth-aachen.de/de", buttonNewTab: true }],
  },
];

const mobilities: StudyCard[] = [
  {
    title: "KVV Studi ticket",
    subtitle: "Semesterticket für den Karlsruher VerkehrsVerbund.",
    listElements: ["Bestätigung via: Shibboleth", "Kosten: 215,50 € / 6 Monate"],
    buttons: [
      {
        text: "Zur Registrierung",
        url: "https://www.kvv.de/fahrkarten/fahrkarten-preise/schueler-studentinnen/studikarte.html",
        buttonNewTab: true,
      },
    ],
  },
  {
    title: "KVV NEXTBIKE",
    subtitle:
      "Nutzung des Nextbike Systems Deutschlandweit. CampusBike Konditionen: Erste 30 Minuten kostenlos, danach 0,50 € pro halbe Stunde bis maximal 5 € pro Tag. Gilt für bis zu 2 Räder gleichzeitig.",
    listElements: ["Freischaltung via: Hochschulmail (bei Registrierung angeben und dann über Link bestätigen)"],
    buttons: [
      {
        text: "Mehr Infos",
        url: "https://www.kvv-nextbike.de/de/campusbike/",
        buttonNewTab: true,
      },
      {
        text: "Zur Registrierung",
        url: "https://secure.nextbike.net/fg/de/registrierung/",
        buttonNewTab: true,
      },
    ],
  },
  {
    title: "BW 365€ Jugendticket",
    subtitle:
      "Berechtigt zur Nutzung des reginalen ÖPNVs in ganz Baden-Württemberg über den Zeitraum eines Jahres. Berechtigt zum Kauf ist jeder bis 21 oder bis 27, wenn in einer Ausbildung oder in einem Studium.",
    listElements: ["Kosten 356 € / Jahr"],
    buttons: [
      {
        text: "Mehr Infos",
        url: "https://vm.baden-wuerttemberg.de/de/mobilitaet-verkehr/oepnv/verkehrsverbuende-tarife/alles-zum-d-ticket-jugendbw",
        buttonNewTab: true,
      },
      {
        text: "Zur Registrierung",
        url: "https://abo.kvv.de/abo/",
        buttonNewTab: true,
      },
    ],
  },
];

const foods: StudyCard[] = [
  {
    title: "Burgerheart",
    subtitle: "20% Rabatt am Montag",
    listElements: [],
    buttons: [],
  },
  {
    title: "Freshsub",
    subtitle: "5 € für einen kleinen Sub (Morgenland, Mama Mozza oder Onkel Pablo) und einer Limo.",
    listElements: [],
    buttons: [],
  },
  {
    title: "Dein Pausenladen",
    subtitle: "Mittagsgerichte für 4-5 € (etwa die Hälfte des normalen Preises).",
    listElements: [],
    buttons: [],
  },
  {
    title: "GO Asia",
    subtitle: "5% Rabatt (wahrscheinlich nicht kombinierbar). Generell 10% Rabatt jeden 1. Samstag im Monat.",
    listElements: [],
    buttons: [],
  },
  {
    title: "Alnatura",
    subtitle: "8% Rabatt jeden Dienstag.",
    listElements: [],
    buttons: [],
  },
];

const other: StudyCard[] = [
  {
    title: "Amazon Prime Student",
    subtitle: "Amazon Prime zum halben Preis. Die ersten 6 Monate sind kostenlos.",
    listElements: [
      "Registrierung via: Hochschulmail",
      "Kosten: 34 € pro Jahr / 4 € pro Monat",
      "Ref-Link des Förderverein der Fachschaft IWI e.V.",
    ],
    buttons: [{ text: "Zur Registrierung", url: "https://www.amazon.de/amazonprime?primeCampaignId=studentWlpPrimeRedir&tag=fachschaftiwi-21", buttonNewTab: true }],
    //LINK FEHLT (reflink erfragen!)
  },
  {
    title: "Hochschulsport",
    subtitle:
      "Der Hochschulsport am KIT bietet für über 4000 Studierende und Beschäftigte des KIT ein buntes Sportangebot in über 70 verschiedenen Disziplinen.",
    listElements: [],
    buttons: [{ text: "Zum Hochschulsport", url: "https://www.ifss.kit.edu/hochschulsport/english/index.php", buttonNewTab: true }],
  },
  {
    title: "Apotheke",
    subtitle: "10% Rabatt auf alle rezeptfreien Produkte",
    listElements: [],
    buttons: [],
  },
  {
    title: "Papier Fischer",
    subtitle: "10% Rabatt auf alle Produkte",
    listElements: [],
    buttons: [],
  },
];

function Index() {
  return (
    <>
      <Header
        title="Wissenswertes für dein Studium"
        subtitle="Alles, was du für dein Studium und neben dem Hörsaal brauchst."
      ></Header>
      <ResponsiveWrapper>
        <div className={"flex flex-col"}>
          <h2>Wichtige Plattformen</h2>
          <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10 mt-2"}>
            {platforms.map((platform: StudyCard, index: number) => (
              <StudyCard
                key={index}
                title={platform.title}
                subtitle={platform.subtitle}
                listElements={platform.listElements}
                buttons={platform.buttons}
              />
            ))}
          </div>

          <h2 className="mt-20">Literatur, Lernunterlagen, & Statistiken</h2>
          <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-2"}>
            {literature.map((literature: StudyCard, index: number) => (
              <StudyCard
                key={index}
                title={literature.title}
                subtitle={literature.subtitle}
                listElements={literature.listElements}
                buttons={literature.buttons}
              />
            ))}
          </div>

          <h2 className="mt-20">Software & Tools</h2>
          <div className={"grid grid-cols-1 lg:grid-cols-2 gap-10 mt-2 "}>
            {softwares.map((software: StudyCard, index: number) => (
              <StudyCard
                key={index}
                title={software.title}
                subtitle={software.subtitle}
                listElements={software.listElements}
                buttons={software.buttons}
              />
            ))}
          </div>

          <h2 className="mt-16">Cloudspeicher & Server</h2>
          <div className={"flex flex-col gap-10 mt-2"}>
            {clouds.map((cloud: StudyCard, index: number) => (
              <StudyCard
                key={index}
                title={cloud.title}
                subtitle={cloud.subtitle}
                listElements={cloud.listElements}
                buttons={cloud.buttons}
              />
            ))}
          </div>

          <h2 className="mt-16">Mobilität & ÖPNV</h2>
          <div className={"flex flex-col gap-10 mt-2"}>
            {mobilities.map((mobility: StudyCard, index: number) => (
              <StudyCard
                key={index}
                title={mobility.title}
                subtitle={mobility.subtitle}
                listElements={mobility.listElements}
                buttons={mobility.buttons}
              />
            ))}
          </div>

          <h2 className="mt-20">Essen & Trinken</h2>
          <div className={"grid grid-cols-1 lg:grid-cols-3 gap-10 mt-2"}>
            {foods.map((food: StudyCard, index: number) => (
              <div key={index} className={`${index % 2 == 1 ? "lg:col-span-2" : ""}`}>
                <StudyCard
                  title={food.title}
                  subtitle={food.subtitle}
                  listElements={food.listElements}
                  buttons={food.buttons}
                />
              </div>
            ))}
          </div>

          <h2 className="mt-20">Sonstiges</h2>
          <div className={"grid grid-cols-1 lg:grid-cols-3 gap-10 mt-2"}>
            {other.map((otherELem: StudyCard, index: number) => (
              <div key={index} className={`${index % 2 == 0 ? "lg:col-span-2" : ""}`}>
                <StudyCard
                  title={otherELem.title}
                  subtitle={otherELem.subtitle}
                  listElements={otherELem.listElements}
                  buttons={otherELem.buttons}
                />
              </div>
            ))}
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
        title: "Studium",
      },
    },
  };
};
