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

            <link href="https://fonts.googleapis.com/css2?family=Muli:wght@700&family=Roboto:wght@300;500&display=swap" rel="stylesheet"></link>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" ></link>

            <title>{ title } | Fachschaft IWI</title>
          </Head>

          <Menu />

          <Header {...pageProps.data.header} />
          
          <section className="main container">
            <Component {...pageProps} />
          </section>
          
          <Footer />
        </>
    )
}

export default IWIWebsite