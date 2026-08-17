import { GetStaticProps } from "next";
import Icon from "@mdi/react";
import {
  mdiAccountTie,
  mdiArrowTopRight,
  mdiCurrencyEur,
  mdiHandshakeOutline,
  mdiHelpCircleOutline,
  mdiInstagram,
  mdiLinkedin,
  mdiMapMarkerRadius,
  mdiPhone,
} from "@mdi/js";

import Header from "../components/common/header";
import ResponsiveWrapper from "../components/common/responsive-wrapper";
import { strings } from "@lib/strings";

const address = {
  room: "Gebäude E · Raum 013",
  street: "Moltkestraße 30",
  city: "76133 Karlsruhe",
  phone: "+49 721 925-2949",
  phoneHref: "tel:+497219252949",
  mapUrl:
    "https://www.openstreetmap.org/search?lat=49.014937&lon=8.390357&zoom=19#map=19/49.014937/8.390357"
};

interface MailContact {
  icon: string;
  title: string;
  description: string;
  mail: string;
}

const mailContacts: MailContact[] = [
  {
    icon: mdiHelpCircleOutline,
    title: "Allgemeine Fragen",
    description:
      "Alles rund ums Studium, die Fachschaft und was dich sonst beschäftigt.",
    mail: strings.contact.mail,
  },
  {
    icon: mdiHandshakeOutline,
    title: "Sponsoring",
    description: "Für Unternehmen, die mit uns zusammenarbeiten möchten.",
    mail: strings.sponsoring.mail,
  },
];

interface Social {
  // Entweder ein mdi-Pfad oder ein Bild – für Discord gibt es kein mdi-Icon
  icon?: string;
  image?: string;
  title: string;
  handle: string;
  url: string;
}

const socials: Social[] = [
  {
    image: "/images/discordLogo.png",
    title: "Discord",
    handle: "Fachschaft IWI",
    url: strings.participate.online.url,
  },
  {
    icon: mdiInstagram,
    title: "Instagram",
    handle: "@iwi_fachschaft",
    url: "https://www.instagram.com/iwi_fachschaft",
  },
  {
    icon: mdiLinkedin,
    title: "LinkedIn",
    handle: "Fachschaft IWI",
    url: "https://www.linkedin.com/in/fachschaft-iwi",
  },
];

function MailCard({ contact }: { contact: MailContact }) {
  return (
    <a
      href={`mailto:${contact.mail}`}
      className="group white_bg rounded-xl p-6 flex flex-col h-full transition duration-200 hover:shadow-lg"
    >
      <Icon
        path={contact.icon}
        size={1.5}
        color="var(--primary_blue)"
        className="mb-4"
      />
      <h4 className="mb-2">{contact.title}</h4>
      <p className="text-sm primary_grey mb-6 flex-grow">
        {contact.description}
      </p>
      <span className="petrol_text font-medium text-sm hyphens-none break-all group-hover:underline">
        {contact.mail}
      </span>
    </a>
  );
}

function SocialRow({ social }: { social: Social }) {
  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 py-4 border-b border-[#DFE4E6] last:border-b-0"
    >
      {social.image ? (
        <img src={social.image} alt="" className="w-6 h-6 object-contain" />
      ) : (
        <Icon path={social.icon} size={1} color="var(--primary_blue)" />
      )}
      <div className="flex flex-col flex-grow">
        <span className="font-medium petrol_text">{social.title}</span>
        <span className="text-sm primary_grey hyphens-none">
          {social.handle}
        </span>
      </div>
      <Icon
        path={mdiArrowTopRight}
        size={0.8}
        color="var(--primary_blue)"
        className="group-hover:rotate-45 transition duration-300"
      />
    </a>
  );
}

function Index() {
  return (
    <>
      <Header
        title="So erreichst du uns"
        subtitle="Wir sind für dich da: Kontaktiere uns per Email, Social Media oder persönlich auf dem Campus!"
      ></Header>

      <ResponsiveWrapper>
        <div className="w-full flex flex-col gap-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 petrol_pale_bg rounded-xl p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-white mt-0 mb-4">Komm vorbei</h2>
                <p className="text-white opacity-80 mb-8 max-w-xl">
                  Du findest uns im Fachschaftsraum auf dem Campus. Einfach
                  reinschauen – meistens ist jemand da.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
                  <div className="flex gap-3">
                    <Icon
                      path={mdiMapMarkerRadius}
                      size={1}
                      color="#7ED1F2"
                      className="flex-shrink-0 mt-1"
                    />
                    <div className="flex flex-col">
                      <span className="text-white">{address.room}</span>
                      <span className="text-white">{address.street}</span>
                      <span className="text-white">{address.city}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Icon
                      path={mdiPhone}
                      size={1}
                      color="#7ED1F2"
                      className="flex-shrink-0 mt-1"
                    />
                    <a
                      href={address.phoneHref}
                      className="text-white hover:underline hyphens-none"
                    >
                      {address.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <a
                  href={address.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 bg-white petrol_text rounded-full px-6 py-3 font-semibold max-w-max"
                >
                  <span>Route planen</span>
                  <Icon
                    path={mdiArrowTopRight}
                    size={0.7}
                    className="group-hover:rotate-45 transition duration-300"
                  />
                </a>
              </div>
            </div>

            <div className="white_bg rounded-xl p-8 flex flex-col">
              <h2 className="text-2xl mt-0 mb-2">Social Media</h2>
              <div className="flex flex-col">
                {socials.map((social) => (
                  <SocialRow key={social.title} social={social} />
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="mt-0 mb-2">Schreib uns</h2>
            <p className="primary_grey mb-8 max-w-2xl">
              Such dir die passende Adresse aus – so landet deine Nachricht
              direkt bei den richtigen Leuten.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {mailContacts.map((contact) => (
                <MailCard key={contact.title} contact={contact} />
              ))}
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
        title: "Kontakt",
      },
    },
  };
};
