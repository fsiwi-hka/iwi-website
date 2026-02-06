import { GetStaticProps } from "next";

import BoxBig from "../components/common/box-big";
import Button from "../components/common/button";
import Carousel from "../components/common/carousel";
import InstagramFeed from "../components/common/InstagramFeed";
import Slider from "../components/common/slider";


export interface Slide {
  title: string;
  subtitle: string;
  image: string;
  imageOverlay: string;
  buttontext: string;
  buttonlink: string;
  cta?: string;
}

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

function Index({ news, events, slides }) {
  return (
    <>
      <Slider slides={slides} />

      <div className="md:px-6 mb-24">
        <div className="flex flex-col md:flex-row md:px-0 gap-y-4 max-w-screen-xl mx-4 md:mx-auto my-6">
          <div className="md:w-1/2 relative">
            <img className="rounded-xl lg:w-3/4 lg:float-right" src="/images/fs-iwi-gesamtbild.jpg"></img>
            <img className="absolute top-0 left-0 invisible lg:visible w-24" src="/images/Shape-1.svg"></img>
          </div>
          <div className="md:w-1/2 pl-6 flex flex-col md:justify-between">
            <div>
              <h2 className="petrol_pale_text mt-0">36+ aktive Fachschaft'ler</h2>
              <p className="primary_grey">
                Wir stehen euch als Ansprechpartner für studienbezogene Fragen zur Verfügung. <br></br>Außerdem
                organisieren wir die O-Phase und den Programmiervorkurs, sammeln Klausuren in unserer Nextcloud, bieten
                Hilfe bei Problemen zwischen Studierenden und ProfessorInnen an, und vieles mehr.
              </p>
            </div>
            <Button type={"large-red"} text={"Jetzt mitmachen"} url={"../Mitmachen"}></Button>
          </div>
        </div>
      </div>

      <div className="md:px-6 mb-24">
        <div className="grid lg:grid-cols-3 gap-x-6 md:px-0 gap-y-4 max-w-screen-xl mx-4 md:mx-auto my-6">
          <BoxBig
            title={"Fachbereiche"}
            subtitle={"Verschiedene Teams mit unterschiedlichen Aufgaben"}
            bgcolor={"primary_blue_bg"}
            buttontext={"Kennenlernen"}
            buttonlink={"/Fachbereiche"}
          ></BoxBig>

          <BoxBig
            title={"Sitzungsprotokolle"}
            subtitle={"Du konntest nicht dabei sein und bist neugierig was du verpasst hast?"}
            bgcolor={"petrol_pale_bg"}
            buttontext={"Übersicht"}
            buttonlink={"/Fachschaft/#sitzungsprotokolle"}
          ></BoxBig>

          <BoxBig
            title={"Discord Server"}
            subtitle={"Für den Austausch relevanter Informationen rund ums Studium"}
            bgcolor={"primary_blue_bg"}
            buttontext={"Beitreten"}
            buttonlink={"https://discord.com/invite/Ud5KQnz"}
            newTab={true}
          ></BoxBig>
        </div>
      </div>

      <InstagramFeed></InstagramFeed>

      <Carousel images={carouselImages} speed={50} />
    </>
  );
}

export default Index;

export const getStaticProps: GetStaticProps = async (context) => {
  const res = await fetch(`http://localhost:3000/api/loader_news?start=0&end=3`);
  const data = await res.json();

  const slides: Slide[] = data.news.map((item: any) => ({
    title: item.title,
    subtitle: item.excerpt,
    image: item.image,
    imageOverlay: "true",
    buttontext: item.cta || "Mehr erfahren",
    buttonlink: `/Aktuelles/article/?item=${item.uuid}`,
  }));

  return {
    props: {
      slides: slides,
      data: {
        title: "Homepage",
      },
    },
  };
};
