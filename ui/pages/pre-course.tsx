import {GetStaticProps} from "next";
import Icon from "@mdi/react";

import Header from "../components/common/header";
import InfoBox from "../components/common/infobox";
import InfoTile from "../components/common/infotile";
import StudyCard, {StudyCardProps} from "../components/common/study-card";
import ResponsiveWrapper from "../components/common/responsive-wrapper";
import {LinkButton} from "./studies";
import {formatRange, useOPhaseInfo} from "@lib/ophase";

export interface PreCourse {
    title: string;
    materials: StudyCardProps[];
}

const requiredSoftware: StudyCardProps[] = [
  {
    title: "java",
    subtitle: "IntelliJ IDEA von Jetbrains",
    listElements: [],
    buttons: [
        new LinkButton( {text: "Jetbrains IntelliJ IDEA", url: "https://www.jetbrains.com/idea/", buttonNewTab: true}),
        new LinkButton({ text: "Java SE 17", url: "https://www.oracle.com/de/java/technologies/downloads/", buttonNewTab: true }),
    ],
  },
  {
    title: "cs",
    subtitle: "Visual Studio Community Edition & .NET",
    listElements: [],
    buttons: [
        new LinkButton( {text: "Jetbrains Rider IDE", url: "https://www.jetbrains.com/rider/", buttonNewTab: true}),
        new LinkButton({ text: "Visual Studio", url: "https://visualstudio.microsoft.com/", buttonNewTab: true }),
        new LinkButton({ text: "Microsoft .net SDK", url: "https://dotnet.microsoft.com/", buttonNewTab: true }),
    ],
  },
  {
    title: "python",
    subtitle: "python 3.x und Jupyter Lab",
    listElements: [],
    buttons: [
        new LinkButton( {text: "Jetbrains Pycharm IDE", url: "https://www.jetbrains.com/pycharm/", buttonNewTab: true}),
        new LinkButton({ text: "Python", url: "https://www.python.org/", buttonNewTab: true }),
        new LinkButton({ text: "Jupyter Lab", url: "https://jupyter.org/", buttonNewTab: true }),
    ],
  },
];

const VORKURS_DIR = "/assets/downloads/vorkurs";

// Die Dateinamen enthalten teils "#", Leerzeichen und Umlaute. Im href müssen die
// kodiert sein, sonst liest der Browser z. B. "C#.pdf" als Fragment "#.pdf".
const vorkursFile = (path: string) =>
    `${VORKURS_DIR}/${path.split("/").map(encodeURIComponent).join("/")}`;

const courses = [
    {
        title: "Vorkurs Java",
        materials: [
            {
                title: "Tag 1",
                subtitle: "Java",
                listElements: [],
                buttons: [
                    new LinkButton({ text: "Folien", url: `${VORKURS_DIR}/java/tag_1/Vorkurs_Java_Tag1.pdf`, buttonNewTab: true }),
                    new LinkButton({ text: "Aufgaben", url: `${VORKURS_DIR}/java/tag_1/Vorkurs_Tag1_Java_Aufgaben.pdf`, buttonNewTab: true }),
                ],
            },
            {
                title: "Tag 2",
                subtitle: "Java",
                listElements: [],
                buttons: [
                    new LinkButton({ text: "Folien", url: `${VORKURS_DIR}/java/tag_2/Vorkurs_Java_Tag2.pdf`, buttonNewTab: true }),
                    new LinkButton({ text: "Aufgaben", url: `${VORKURS_DIR}/java/tag_2/Vorkurs_Tag2_Java_Aufgaben.pdf`, buttonNewTab: true }),
                ],
            },
            {
                title: "Tag 3",
                subtitle: "Java",
                listElements: [],
                buttons: [
                    new LinkButton({ text: "Folien", url: `${VORKURS_DIR}/java/tag_3/Vorkurs_Java_Tag3.pdf`, buttonNewTab: true }),
                    new LinkButton({ text: "Aufgaben", url: `${VORKURS_DIR}/java/tag_3/Vorkurs_Tag3_Java_Aufgaben.pdf`, buttonNewTab: true }),
                ],
            },
            {
                title: "Tag 4",
                subtitle: "Java",
                listElements: [],
                buttons: [
                    new LinkButton({ text: "Folien", url: `${VORKURS_DIR}/java/tag_4/Vorkurs_Java_Tag4.pdf`, buttonNewTab: true }),
                ],
            }
        ]
    },
    {
        title: "Vorkurs C#",
        materials: [
            {
                title: "Tag 1",
                subtitle: "C#",
                listElements: [],
                buttons: [
                    new LinkButton({ text: "Folien", url: vorkursFile("cs/tag_1/Vorkurs_Tag1_C#.pdf"), buttonNewTab: true }),
                    new LinkButton({ text: "Aufgaben", url: vorkursFile("cs/tag_1/Vorkurs_Tag1_C#_Aufgaben.pdf"), buttonNewTab: true }),
                    new LinkButton({ text: "Lösungen", url: vorkursFile("cs/tag_1/Vorkurs_Tag1_C#_Loesungen.pdf"), buttonNewTab: true }),
                ],
            },
            {
                title: "Tag 2",
                subtitle: "C#",
                listElements: [],
                buttons: [
                    new LinkButton({ text: "Folien", url: vorkursFile("cs/tag_2/Vorkurs_Tag2_C#.pdf"), buttonNewTab: true }),
                    new LinkButton({ text: "Aufgaben", url: vorkursFile("cs/tag_2/Vorkurs_Tag2_C#_Aufgaben.pdf"), buttonNewTab: true }),
                    new LinkButton({ text: "Lösungen", url: vorkursFile("cs/tag_2/Vorkurs_Tag2_C#_Loesungen.pdf"), buttonNewTab: true }),
                ],
            },
            {
                title: "Tag 3",
                subtitle: "C#",
                listElements: [],
                buttons: [
                    new LinkButton({ text: "Folien", url: vorkursFile("cs/tag_3/Vorkurs_Tag3_C#.pdf"), buttonNewTab: true }),
                    new LinkButton({ text: "Aufgaben", url: vorkursFile("cs/tag_3/C#_Tag3_Aufgaben.pdf"), buttonNewTab: true }),
                    new LinkButton({ text: "Lösungen", url: vorkursFile("cs/tag_3/Vorkurs_Tag3_C#_Loesungen.pdf"), buttonNewTab: true }),
                    new LinkButton({ text: "Lösungen (VS Code)", url: vorkursFile("cs/tag_3/Vorkurs_Tag3_C#_Lösungen (in VSCode).pdf"), buttonNewTab: true }),
                ],
            },
            {
                title: "Tag 4",
                subtitle: "C#",
                listElements: [],
                buttons: [
                    new LinkButton({ text: "Folien", url: vorkursFile("cs/tag_4/Vorkurs_Tag4_C#.pdf"), buttonNewTab: true }),
                    new LinkButton({ text: "Aufgaben", url: vorkursFile("cs/tag_4/Vorkurs_Tag4_C#_Aufgaben.pdf"), buttonNewTab: true }),
                    // Die Lösungen zu den Aufgaben 4.1-4.8 liegen nur als Screenshot vor.
                    // Vorkurs_Tag4_C#_Loesungen.pdf gehört zu einer anderen Aufgabenreihe (Kaffeemaschine).
                    new LinkButton({ text: "Lösungen", url: vorkursFile("cs/tag_4/Vorkurs_Tag4_C4_new_Lösungen.png"), buttonNewTab: true }),
                    new LinkButton({ text: "Weitere Aufgaben", url: vorkursFile("cs/tag_4/Vorkurs_Tag_C#_weitere Aufgaben mit Lösungen.pdf"), buttonNewTab: true }),
                ],
            },
            {
                title: "Blackjack",
                subtitle: "C# – Projekt (Tag 4)",
                listElements: [],
                buttons: [
                    new LinkButton({ text: "Anleitung", url: vorkursFile("cs/tag_4/Blackjack/Blackjack_mitAnweisungen_mitAbfragen.png"), buttonNewTab: true }),
                    new LinkButton({ text: "Lösung", url: vorkursFile("cs/tag_4/Blackjack/Blackjack_ohneAnweisungen.png"), buttonNewTab: true }),
                    new LinkButton({ text: "Program.cs", url: vorkursFile("cs/tag_4/Blackjack/Program.cs"), buttonNewTab: true }),
                ],
            },
            {
                title: "Schere, Stein, Papier",
                subtitle: "C# – Projekt (Tag 4)",
                listElements: [],
                buttons: [
                    new LinkButton({ text: "Vorlage", url: vorkursFile("cs/tag_4/Schere Stein Papier/SchereSteinPapier_Vorlage.cs"), buttonNewTab: true }),
                ],
            },
        ]
    },
    {
        title: "Vorkurs Python",
        materials: [
            {
                title: "Tag 1",
                subtitle: "Python",
                listElements: [],
                buttons: [
                    new LinkButton({ text: "Notebook", url: vorkursFile("python/tag_1/Vorkurs_Tag_1.ipynb"), buttonNewTab: true }),
                    new LinkButton({ text: "Aufgaben", url: vorkursFile("python/tag_1/Vorkurs_Tag_1_Aufgaben.ipynb"), buttonNewTab: true }),
                    new LinkButton({ text: "Lösungen", url: vorkursFile("python/tag_1/Vorkurs_Tag_1_Loesungen.ipynb"), buttonNewTab: true }),
                    new LinkButton({ text: "Notizen", url: vorkursFile("python/tag_1/Vorkurs_Tag_1_Notizen.ipynb"), buttonNewTab: true }),
                ],
            },
            {
                title: "Tag 2",
                subtitle: "Python",
                listElements: [],
                buttons: [
                    new LinkButton({ text: "Notebook", url: vorkursFile("python/tag_2/Vorkurs_Tag_2.ipynb"), buttonNewTab: true }),
                    new LinkButton({ text: "Aufgaben", url: vorkursFile("python/tag_2/Vorkurs_Tag_2_Aufgaben.ipynb"), buttonNewTab: true }),
                    new LinkButton({ text: "Lösungen", url: vorkursFile("python/tag_2/Vorkurs_Tag_2_Loesungen.ipynb"), buttonNewTab: true }),
                    new LinkButton({ text: "Notizen", url: vorkursFile("python/tag_2/Vorkurs_Tag_2_Notizen.ipynb"), buttonNewTab: true }),
                ],
            },
            {
                title: "Tag 3",
                subtitle: "Python",
                listElements: [],
                buttons: [
                    new LinkButton({ text: "Notebook", url: vorkursFile("python/tag_3/Vorkurs_Tag_3.ipynb"), buttonNewTab: true }),
                    new LinkButton({ text: "Aufgaben", url: vorkursFile("python/tag_3/Vorkurs_Tag_3_Aufgaben.ipynb"), buttonNewTab: true }),
                    new LinkButton({ text: "Bonusaufgaben", url: vorkursFile("python/tag_3/Vorkurs_Tag_3_Aufgaben_Bonus.ipynb"), buttonNewTab: true }),
                    new LinkButton({ text: "Lösungen", url: vorkursFile("python/tag_3/Vorkurs_Tag_3_Loesungen.ipynb"), buttonNewTab: true }),
                ],
            },
            {
                title: "Tag 4",
                subtitle: "Python",
                listElements: [],
                buttons: [
                    new LinkButton({ text: "Notebook", url: vorkursFile("python/tag_4/Vorkurs_Tag_4.ipynb"), buttonNewTab: true }),
                    new LinkButton({ text: "Aufgaben", url: vorkursFile("python/tag_4/Vorkurs_Tag_4_Aufgaben.ipynb"), buttonNewTab: true }),
                    new LinkButton({ text: "Lösungen", url: vorkursFile("python/tag_4/Vorkurs_Tag_4_Loesungen.ipynb"), buttonNewTab: true }),
                    new LinkButton({ text: "diamonds.csv", url: vorkursFile("python/tag_4/diamonds.csv"), buttonNewTab: true }),
                ],
            },
        ]
    }
] satisfies PreCourse[];

function Index() {
  const info = useOPhaseInfo();

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
                  <InfoTile title="Datum" text={formatRange(info?.vorkurse?.programmieren)} />
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
            <li><strong>Java:</strong> LI137</li>
            <li><strong>C#:</strong> LI146</li>
            <li><strong>Python:</strong> LI145</li>
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
                    <div>Java: LI137</div>
                    <div>C#: LI146</div>
                    <div>Python: LI145</div>
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
                <p className="mb-4">Hier werden die Kursunterlagen im Verlaufe des Kurses zur Verfügung gestellt.</p>
                {courses.map((course, index_out) => (
                    <div key={index_out} className="flex flex-col w-full mb-8">
                        <h4 className={"pretrol_pale_text mt-4 mb-4"} key={index_out}>{course.title}</h4>
                        <div className={"flex flex-row w-full "}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                                {course.materials.map((day, index_inner) => (
                                    <StudyCard
                                        key={index_inner}
                                        title={day.title}
                                        subtitle={day.subtitle}
                                        listElements={day.listElements}
                                        buttons={day.buttons}/>
                                ))}
                            </div>
                        </div>
                    </div>

                ))}
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
