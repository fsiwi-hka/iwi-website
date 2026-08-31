import { GetStaticProps } from "next";

import BoxBig from "../components/common/box-big";
import Button from "../components/common/button";
import Carousel from "../components/common/carousel";
import InstagramFeed from "../components/common/InstagramFeed";
import Slider from "../components/common/slider";
import { slides } from "../content/slides";
import { sponsorLogos } from "../content/sponsors";

function Index() {
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

      <Carousel images={sponsorLogos} speed={50} />
    </>
  );
}

export default Index;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      data: { title: "Homepage" },
    },
  };
};
