import { GetStaticProps } from "next";
import Icon from "@mdi/react";

import BoxFullWidthBlue from "../components/common/box-full-width-blue";
import Header from "../components/common/header";
import InfoBox from "../components/common/infobox";
import InfoTile from "../components/common/infotile";
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

const requiredSoftware: StudyCard[] = [
  {
    title: "Java",
    subtitle: "IntelliJ IDEA von Jetbrains",
    listElements: [],
    buttons: [
      { text: "IntelliJ IDEA", url: "https://www.jetbrains.com/idea/", buttonNewTab: true },
    ],
  },
  {
    title: "C#",
    subtitle: "Visual Studio Community Edition & .NET",
    listElements: [],
    buttons: [
      { text: "Visual Studio", url: "https://visualstudio.microsoft.com/", buttonNewTab: true },
      { text: ".net", url: "https://dotnet.microsoft.com/", buttonNewTab: true },
    ],
  },
  {
    title: "Python",
    subtitle: "Python 3.x und Jupyter Lab",
    listElements: [],
    buttons: [
      { text: "Python", url: "https://www.python.org/", buttonNewTab: true },
      { text: "Jupyter Lab", url: "https://jupyter.org/", buttonNewTab: true },
    ],
  },
];

const downloadMaterials: StudyCard[] = [
  { title: "Tag 1", subtitle: "", listElements: [], buttons: [{ text: "Herunterladen", url: "#", buttonNewTab: true }] }, // Link muss ergänzt werden
  { title: "Tag 2", subtitle: "", listElements: [], buttons: [{ text: "Herunterladen", url: "#", buttonNewTab: true }] }, // Link muss ergänzt werden
  { title: "Tag 3", subtitle: "", listElements: [], buttons: [{ text: "Herunterladen", url: "#", buttonNewTab: true }] }, // Link muss ergänzt werden
  { title: "Tag 4", subtitle: "", listElements: [], buttons: [{ text: "Herunterladen", url: "#", buttonNewTab: true }] }, // Link muss ergänzt werden
]; 



function Index() {
  return (
    <>
      <Header
        title="Programmiervorkurs"
        subtitle="Der Programmiervorkurs ist für alle Erstis gedacht, die in einem Studiengang der Fakultät Informatik und Wirtschaftsinformatik (IWI) eingeschrieben sind."
      />

      <ResponsiveWrapper>
        <div className="max-w-screen-xl w-full mx-auto">
          <div className="flex flex-col justify-between">
            <h3 className="petrol_pale_text mt-4 mb-4"> System.out.println("Programmiervorkurs"); </h3>
            <p>
              Um Erstis, die zuvor noch nie etwas programmiert haben, den Einstieg zu vereinfachen, bieten wir einen Programmierkurs an.
              Keine Angst, in den Vorlesungen wird nicht vorausgesetzt, dass du schon programmieren kannst! Trotzdem ist es hilfreich, wenn du schon ein wenig
              mit den Grundlagen vertraut bist. So lässt sich das Gehörte leichter einordnen und behalten.
            </p>
            <InfoBox icon="exclamation">
              Der Vorkurs wendet sich in erster Linie an absolute Programmier-Neulinge. Natürlich sind auch alle anderen Erstis der Fakultät IWI eingeladen,
              die ihre Kenntnisse auffrischen wollen.
            </InfoBox>
          </div>
        </div>
      </ResponsiveWrapper>

      <ResponsiveWrapper>
        <div className="max-w-screen-xl w-full mx-auto">
          <div className="flex flex-col justify-between">
            <h3 className="petrol_pale_text mt-4 mb-4">Überblick</h3>

            <div className="">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-4">
                  <InfoTile title="Datum" text="16. - 19.09.2024 (Montag - Donnerstag)" />
                </div>
                <div className="col-span-12 lg:col-span-2">
                  <InfoTile title="Ort" text="Präsenz" />
                </div>
                <div className="col-span-12 lg:col-span-3">
                  <InfoTile title="Programmiersprachen" text="Java, C#, Python" />
                </div>
                <div className="col-span-12 lg:col-span-3">
                  <InfoTile title="Kosten" text="Kostenlos" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 mt-4 items-stretch">
              <div className="col-span-12 md:col-span-9 flex flex-col gap-4">
                <InfoTile
                  title="Zugelassene Studiengänge"
                  text="Informatik, Medieninformatik, Wirtschaftsinformatik, Internationales IT Business, Data Science"
                />
                <InfoTile
                  title="Themen"
                  text="Variablen, Kontrollstrukturen, Schleifen, Funktionen, Grundlagen der objektorientierten Programmierung"
                />
              </div>
              <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
                <InfoTile title="Benötigte Hardware" text="Eigener Laptop" />
                <InfoTile title="Benötigte Vorkenntnisse" text="Keine" />
              </div>
            </div>
          </div>
        </div>
      </ResponsiveWrapper>

      <ResponsiveWrapper>
        <div className="max-w-screen-xl mx-auto">
          <h3 className="text-2xl font-bold text-primary_blue mt-8 mb-4">Tagesablauf</h3>

          <p className="mb-4">
            Wir beginnen jeden Tag um <strong>10 Uhr</strong>. Am ersten Tag erklären wir euch in dieser Zeit den Ablauf und das Vorgehen.
          </p>

          <p className="mb-4">Raumeinteilung wird folgende sein:</p>
          <ul className="list-disc list-inside mb-4">
            <li><strong>Java:</strong> E203</li>
            <li><strong>C#:</strong> LI137</li>
            <li><strong>Python:</strong> E302</li>
          </ul>

          <p className="mb-4">
            Von <strong>10:00 bis 12:00 Uhr</strong> bekommt ihr die Theorie vermittelt. Keine Sorge! Wir machen das anschaulich, praxisnah und ihr könnt jederzeit Fragen stellen.
          </p>

          <p className="mb-4">
            Dann ist erst mal Mittagspause. Da könnt ihr euch den Tutoren anschließen mit in die Mensa oder in die Stadt zu gehen.
          </p>

          <p className="mb-4">
            Den Nachmittag (ab <strong>13:00 Uhr</strong>) habt ihr dann, um Aufgaben zum morgens Erlernten zu bearbeiten. Dabei stehen euch Tutoren zur Verfügung, falls ihr nicht weiterkommen solltet. Außerdem habt ihr während dieser Zeit die Möglichkeit, eure zukünftigen Mitstudierenden kennenzulernen. Wir treffen uns dann wieder im gleichen Raum wie vormittags.
          </p>

          <p className="mb-4">
            Der Tag endet für euch, wenn ihr mit den Übungen fertig seid. Je nach Tempo meistens zwischen <strong>15:00</strong> und <strong>17:00 Uhr</strong>. Die Tutoren bleiben natürlich bis zum Schluss.
          </p>

          <p>
            Bei Interesse können wir den Tag auch noch gemütlich in der Fachschaft ausklingen lassen.
          </p>
        </div>
      </ResponsiveWrapper>

      
      <div id="mitmachen">
        <BoxFullWidthBlue
          title="Möchtest du mit dabei sein?"
          subtitle="Sende uns eine E-Mail mit einer kurzen Nachricht, deinem Namen und deinem Studiengang."
          buttontext="Jetzt mitmachen"
          buttonlink="../Mitmachen" // # macht das hier überhaupt Sinn?
          belowText="Keine Vorkenntnisse nötig - jede:r ist willkommen!"
        />
      </div>

      <ResponsiveWrapper>
        <div className="w-full my-4">
            <h3 className="petrol_pale_text mt-4 mb-4">Kurzübersicht</h3>

            <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm md:text-base">
                <thead className="bg-white text-primary_blue font-semibold">
                <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">ZEITRAUM</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">WAS?</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">WO?</th>
                </tr>
                </thead>
                <tbody className="primary_grey">
                <tr>
                    <td className="border border-gray-300 px-4 py-4 align-middle">10:00 - 12:00 Uhr</td>
                    <td className="border border-gray-300 px-4 py-4 align-middle">
                    Infos, Übungsbesprechung,<br />Vorlesung
                    </td>
                    <td className="border border-gray-300 px-4 py-4 align-middle">
                    <div>Java: E203</div>
                    <div>C#: LI137</div>
                    <div>Python: E302</div>
                    </td>
                </tr>
                <tr>
                    <td className="border border-gray-300 px-4 py-4 align-middle">12:00 - 13:00 Uhr</td>
                    <td className="border border-gray-300 px-4 py-4 align-middle">Mittagspause</td>
                    <td className="border border-gray-300 px-4 py-4 align-middle">Zusammen in der Mensa<br />oder Stadt</td>
                </tr>
                <tr>
                    <td className="border border-gray-300 px-4 py-4 align-middle">ab 13:00 Uhr</td>
                    <td className="border border-gray-300 px-4 py-4 align-middle">
                    Übungen, gemütliches<br />Zusammensitzen
                    </td>
                    <td className="border border-gray-300 px-4 py-4 align-middle">Wie vormittags</td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
        </ResponsiveWrapper>

        <ResponsiveWrapper>
            <div className="w-full my-4">
                <h3 className="petrol_pale_text mt-4 mb-4">Benötigte Software</h3>
                <p className="mb-4">Es empfiehlt sich die Programmieraufgaben auf einem eigenen Laptop durchzuführen. Die hierfür benötigte Software wird gemeinsam am ersten Tag installiert und eingerichtet.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {requiredSoftware.map((tool, index) => (
                    <StudyCard
                        key={index}
                        title={tool.title}
                        subtitle={tool.subtitle}
                        listElements={tool.listElements}
                        buttons={tool.buttons}
                    />
                    ))}
                </div>
            </div>
        </ResponsiveWrapper>

        <ResponsiveWrapper>
            <div className="w-full my-4">
                <h3 className="petrol_pale_text mt-4 mb-4">Unterlagen</h3>
                <p className="mb-4">Hier werden die Vorlesungsunterlagen im Verlaufe des Kurses zur Verfügung gestellt.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                    {downloadMaterials.map((day, index) => (
                    <StudyCard
                        key={index}
                        title={day.title}
                        subtitle={day.subtitle}
                        listElements={day.listElements}
                        buttons={day.buttons}
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
        title: "Programmiervorkurs",
      },
    },
  };
};

function BoxWithIcon({ icon, children }) {
  return (
    <div className="flex gap-4">
      <div className="w-auto">
        <Icon color="var(--primary_blue)" path={icon} size={2.5} />
      </div>
      <p className="primary_grey">{children}</p>
    </div>
  );
}
