import { GetStaticProps } from "next";

import Header from "../components/common/header";
import ResponsiveWrapper from "../components/common/responsive-wrapper";
import { mdiChevronRight, mdiAccount } from "@mdi/js";
import Icon from "@mdi/react";

// Vorstand - Mitglieder
const Vorstand_Mitglieder = [
  { img: "/images/fachschaft/placeholder.jpg", position: "Position A", name: "Max Mustermann" },
  { img: "/images/fachschaft/placeholder.jpg", position: "Position B", name: "Max Mustermann" },
  { img: "/images/fachschaft/placeholder.jpg", position: "Position C", name: "Max Mustermann" },
  { img: "/images/fachschaft/placeholder.jpg", position: "Position D", name: "Max Mustermann" },
  { img: "/images/fachschaft/placeholder.jpg", position: "Position E", name: "Max Mustermann" },
  { img: "/images/fachschaft/placeholder.jpg", position: "Position F", name: "Max Mustermann" },
  { img: "/images/fachschaft/placeholder.jpg", position: "Position H", name: "Max Mustermann" },
  { img: "/images/fachschaft/placeholder.jpg", position: "Position H", name: "Max Mustermann" },
];

// Vorstand - Aufgaben
const Vorstand_Aufgaben = [
  "Protokolle schreiben",
  "Protokolle schreiben",
  "Protokolle schreiben",
  "Protokolle schreiben",
  "Protokolle schreiben",
];

function Index() {
  return (
    <>
      <Header
        title="VORSTAND & FACHBEREICHE"
        subtitle=""
      />

      <ResponsiveWrapper>
        <div className="max-w-screen-xl w-full mx-auto">
          <h2 className="mt-6 mb-2 text-2xl font-extrabold text-primary_blue">VORSTAND</h2>
          <p className="text-gray-700"> {/* Anpassen: Demo-Text*/}
            Die Rollen in der Fachschaft sind klar verteilt. Es gibt die Vorstandsebene und die Fachbereiche innerhalb der Fachschaft.
            Der Vorstand (1. & 2. Vorstand sowie 1. & 2. Finanzer) werden für ein Jahr laut Satzung zu Beginn jedes Wintersemesters gewählt.
          </p>

          <div className="mt-6 mb-6">
            <p className="mb-3 text-sm font-extrabold uppercase tracking-wide text-gray-700">AUFGABEN</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-800">
              {/* Anpassen: Demo-Text*/}
              {Vorstand_Aufgaben.map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Icon path={mdiChevronRight} size={0.9} />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

            {/* Linke Spalte (2/3) – Mitglieder */}
            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Vorstand_Mitglieder.map((m, i) => (
                    <div
                    key={i}
                    className="flex items-center gap-4 bg-white"
                    >
                    <img
                        src={m.img}
                        alt={m.name}
                        className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-bold text-primary_blue mb-0 mt-4">{m.position}</p>
                        <p className="text-gray-700">{m.name}</p>
                    </div>
                    </div>
                ))}
                </div>
            </div>

            {/* Rechte Spalte (1/3) – Ansprechpartner */}
            <aside className="rounded-2xl white_bg p-6 h-fit">
                <p className="mb-4 text-lg font-bold text-primary_blue">Ansprechpartner Vorstand</p>
                <div className="flex items-center gap-3">
                <Icon
                  path={mdiAccount}
                  size={1.2}
                  className="primary_blue"
                />
                <span className="text-gray-800">Dustin Sommerfeld</span>
                </div>
            </aside>
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
      data: { title: "Fachbereiche" },
    },
  };
};
