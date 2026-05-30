import PageHead from "./../components/common/page-head";
import Header from "./../components/common/header";
import Footer from "./../components/common/footer";
import Menu from "./../components/common/menu";
import "react-calendar/dist/Calendar.css";
import "../styles/index.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

function IWIWebsite({ Component, pageProps }) {
  if ((Component as any).noLayout) {
    return <Component {...pageProps} />;
  }

  const og = pageProps.data?.og;
  const title = pageProps.data?.title;

  return (
    <>

      <PageHead title={title} og={og} />

      <Menu />

      <section className="main w-full mx-auto flex flex-col flex-grow">
        <Component {...pageProps} />
      </section>

      <Footer />

      <script src="/scripts/menu.js"></script>
    </>
  );
}

export default IWIWebsite;
