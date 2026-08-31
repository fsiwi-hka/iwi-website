import { GetStaticProps } from "next";

import Button from "../components/common/button";
import { strings } from "@lib/strings";
import Header from "../components/common/header";
import ResponsiveWrapper from "../components/common/responsive-wrapper";


export default function Custom500() {
  return (
    <>
      <Header
        title="Server-Fehler"
        subtitle="Wir machen das Ganze ja auch nur ehrenamtlich."
        showBreadcrumbs={false}
      ></Header>
     <ResponsiveWrapper>
        <Button type={"large-blue1"} text={"Gib uns gerne Bescheid"} url={`mailto:${strings.contact.mail}?subject=Error 500 auf der Website`}></Button>
     </ResponsiveWrapper>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      data: {
        title: "500",
      },
    },
  };
};
