import { GetStaticProps } from "next";

import Header from "../components/common/header";
import MarkdownSection from "../components/common/markdown-section";
import ResponsiveWrapper from "../components/common/responsive-wrapper";


function Index() {
  return (
    <>
      <Header title="Hast du Fragen? Willst du Mitmachen?" subtitle=""></Header>
      <ResponsiveWrapper>
        <div><MarkdownSection fileUrl={"/mitmachen.md"}></MarkdownSection></div>
        
      </ResponsiveWrapper>
    </>
  );
}

export default Index;

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      data: {
        title: "Mitmachen",
      },
    },
  };
};
