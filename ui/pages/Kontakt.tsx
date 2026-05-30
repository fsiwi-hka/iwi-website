import { GetStaticProps } from "next";

import ContactBox from "../components/common/contact-box";
import Header from "../components/common/header";
import ResponsiveWrapper from "../components/common/responsive-wrapper";


import {
  mdiMapMarkerRadius,
  mdiPhone,
  mdiEmailFast,
  mdiInstagram,
  mdiLinkedin,
} from "@mdi/js";
//Discord fehlt, wurde durch PNG ersetzt

interface ContactList {
  title: string;
  contactItems: ContactItem[];
}

interface ContactItem {
  imageSrc: string;
  items: string[];
  isLink?: boolean;
}

interface ContactBox {
  title: string;
  contactLists: ContactList[];
  direction: "vertical" | "horizontal";
}

const contacts: ContactBox[] = [
  {
    title: "Kontakt & Anschrift",
    contactLists: [
      {
        title: "Fachschaft IWI",
        contactItems: [
          {
            imageSrc: mdiMapMarkerRadius,
            items: [
              "Gebäude E - Raum 013",
              "Moltkestraße 30",
              "76133 Karlsruhe",
            ],
          },
          {
            imageSrc: mdiPhone,
            items: ["+49 721 925-2949"],
          },
        ],
      },
      {
        title: "Allgemeine Fragen",
        contactItems: [
          {
            imageSrc: mdiEmailFast,
            items: ["kontakt@iwi-hka.de"],
          },
        ],
      },
      {
        title: "Anfragen an den Vorstand",
        contactItems: [
          {
            imageSrc: mdiEmailFast,
            items: ["vorstand@iwi-hka.de"],
          },
        ],
      },
    ],
    direction: "vertical",
  },
];

const sponsoring: ContactBox[] = [
  {
    title: "FB Sponsoring",
    contactLists: [
      {
        title: "Sponsoring- und Kooperationsanfragen",
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
];

const finances: ContactBox[] = [
  {
    title: "FB Finanzen",
    contactLists: [
      {
        title: "Allgemeine Anfragen",
        contactItems: [
          {
            imageSrc: mdiEmailFast,
            items: ["finanzen@iwi-hka.de"],
          },
        ],
      },
    ],
    direction: "vertical",
  },
];

const marketing: ContactBox[] = [
  {
    title: "FB Marketing",
    contactLists: [
      {
        title: "Discord",
        contactItems: [
          {
            imageSrc: "/images/discordLogo.png", //Icon als PNG, kein mdi (Material Design Icon) vorhanden
            items: ["discord.com/invite/Ud5KQnz"],
            isLink: true,
          },
        ],
      },
      {
        title: "Instagram",
        contactItems: [
          {
            imageSrc: mdiInstagram,
            items: ["instagram.com/iwi_fachschaft"],
            isLink: true,
          },
        ],
      },
      {
        title: "LinkedIn",
        contactItems: [
          {
            imageSrc: mdiLinkedin,
            items: ["linkedin.com/in/fachschaft-iwi"],
            isLink: true,
          },
        ],
      },
    ],
    direction: "horizontal",
  },
];

function Index() {
  return (
    <>
      <Header
        title="So erreichst du uns"
        subtitle="Wir sind für dich da: Kontaktiere uns per Email, Socialmedia oder persönlich auf dem Campus!"
      ></Header>
      <ResponsiveWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 my-10 w-full gap-10">
          <div>
            {contacts.map((contact, index) => (
              <ContactBox
                key={index}
                title={contact.title}
                contactLists={contact.contactLists}
                direction={contact.direction}
              />
            ))}
          </div>
          <div className={"flex flex-col justify-between gap-10"}>
            <div className="flex-1">
              {sponsoring.map((sponsor, index) => (
                <ContactBox
                  key={index}
                  title={sponsor.title}
                  contactLists={sponsor.contactLists}
                  direction={sponsor.direction}
                />
              ))}
            </div>
            <div className="flex-1">
              {finances.map((finance, index) => (
                <ContactBox
                  key={index}
                  title={finance.title}
                  contactLists={finance.contactLists}
                  direction={finance.direction}
                />
              ))}
            </div>
          </div>
          <div className={"lg:col-span-2"}>
            {marketing.map((marketing, index) => (
              <ContactBox
                key={index}
                title={marketing.title}
                contactLists={marketing.contactLists}
                direction={marketing.direction}
              />
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
        title: "Kontakt",
      },
    },
  };
};
