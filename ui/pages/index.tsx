import fs from "fs";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import path from "path";

import BoxBig from "../components/common/box-big";
import Button from "../components/common/button";
import Carousel from "../components/common/carousel";
import InstagramFeed from "../components/common/InstagramFeed";
import Slider from "../components/common/slider";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
}


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
    url: "/images/unternehmen/8com.png",
    size: 140,
  },
  {
    url: "/images/unternehmen/bock.png",
    size: 70,
  },
  {
    url: "/images/unternehmen/broadpin.jpg",
    size: 130,
  },
  {
    url: "/images/unternehmen/ctdi.png",
    size: 160,
  },
  {
    url: "/images/unternehmen/dmTech.png",
    size: 50,
  },
  {
    url: "/images/unternehmen/gameforge.jpg",
    size: 180,
  },
  {
    url: "/images/unternehmen/init.png",
    size: 95,
  },
  {
    url: "/images/unternehmen/the_laend.png",
    size: 180,
  },
  {
    url: "/images/unternehmen/vector.png",
    size: 105,
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
              <h2 className="petrol_pale_text mt-0">Die Fachschaft IWI</h2>
              <p className="primary_grey">
                Wir stehen euch als Ansprechpartner für studienbezogene Fragen zur Verfügung. <br></br>Außerdem
                organisieren wir die O-Phase und den Programmiervorkurs, bieten Hilfe bei Problemen zwischen
                Studierenden und Professor:innen und vieles mehr an.
              </p>
            </div>
            <Button type={"large-red"} text={"Jetzt mitmachen"} url={"/about/#mitmachen"}></Button>
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
            buttonlink={"/about/#fachbereiche"}
          ></BoxBig>

          <BoxBig
            title={"Sitzungsprotokolle"}
            subtitle={"Du konntest nicht dabei sein und bist neugierig was du verpasst hast?"}
            bgcolor={"petrol_pale_bg"}
            buttontext={"Übersicht"}
            buttonlink={"/about/#sitzungsprotokolle"}
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

export const getStaticProps: GetStaticProps = async () => {
  const baseDir = path.join(process.cwd(), "content/news");
  const now = new Date();
  const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  const maxWordCountExcerpt = 10;

  const files = fs
    .readdirSync(baseDir)
    .filter((file) => file.toLowerCase().endsWith(".md") && file !== "readme.md")
    .sort((a, b) => a.localeCompare(b));

  const allNews = files
    .map((file) => {
      const { data } = matter(fs.readFileSync(path.join(baseDir, file), "utf-8"));
      return data;
    })
    .filter(
      (data) =>
        data.title &&
        data.excerpt &&
        data.author &&
        now >= new Date(data.publishDate) &&
        new Date(data.publishDate) >= oneYearAgo &&
        data.image &&
        data.published
    )
    .map((data) => ({
      uuid: data.publishDate + "_" + slugify(data.title),
      title: data.title as string,
      excerpt:
        data.excerpt.split(" ").length < maxWordCountExcerpt
          ? data.excerpt
          : data.excerpt.split(" ").slice(0, maxWordCountExcerpt).join(" ") + "...",
      cta: (data.cta as string) || "",
      image: data.image as string,
    }));

  const slides: Slide[] = allNews.slice(0, 3).map((item) => ({
    title: item.title,
    subtitle: item.excerpt,
    image: item.image,
    imageOverlay: "true",
    buttontext: item.cta || "Mehr erfahren",
    buttonlink: `/news/article/?item=${item.uuid}`,
  }));

  return {
    props: {
      slides,
      data: { title: "Homepage" },
    },
  };
};
