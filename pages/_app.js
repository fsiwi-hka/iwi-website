import Head from 'next/head'
import Header from './../components/common/header'
import Footer from './../components/common/footer'
import Menu from './../components/common/menu'
import '../styles/index.css'

function IWIWebsite({ Component, pageProps }) {
    const og = pageProps.data?.og
    const title = pageProps.data?.title

    return (
        <>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta property="og:title" content={title || `Fachschaft IWI`} />
            <meta property="og:site_name" content="Fachschaft IWI" />
            <meta property="og:description" content={og ? og.description : `Die Website der Fachschaft IWI, Hochschule Karlsruhe (HKA)`} />
            <meta name="twitter:site" content="@fsi_hska" />

            <title>{title || `Fachschaft IWI`}</title>
          </Head>

          <Header />

          <Menu />
          
          <section className="main container">
            <Component {...pageProps} />
          </section>
          
          <Footer />
        </>
    )
}

export default IWIWebsite