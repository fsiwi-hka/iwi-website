import { GetStaticProps } from "next";

import Header from "../components/common/header";
import MarkdownSection from "../components/common/markdown-section";
import ResponsiveWrapper from "../components/common/responsive-wrapper";


function Index() {
  return (
    <>
      <Header title="Impressum" subtitle="Angaben gemäß § 5 DDG"></Header>
      <ResponsiveWrapper>
        <div><MarkdownSection fileUrl={"/impressum.md"}></MarkdownSection></div>
        
      </ResponsiveWrapper>
    </>
  );
}

export default Index;

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      data: {
        title: "Impressum",
      },
    },
  };
};
