import { GetStaticProps } from "next";

import Button from "../components/common/button";
import Header from "../components/common/header";
import ResponsiveWrapper from "../components/common/responsive-wrapper";


export default function Custom404() {
  return (
    <>
      <Header
        title="404"
        subtitle="Was auch immer du gesucht hast, hier ist es leider nicht..."
        showBreadcrumbs={false}
      ></Header>
      <ResponsiveWrapper>
        <Button
          type={"large-blue1"}
          text={"Zur Startseite"}
          url={"/Startseite"}
        ></Button>
      </ResponsiveWrapper>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      data: {
        title: "404",
      },
    },
  };
};
