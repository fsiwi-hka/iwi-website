import Head from 'next/head'
import Header from './../components/common/header'
import Footer from './../components/common/footer'
import Menu from './../components/common/menu'
import 'react-calendar/dist/Calendar.css'
import '../styles/index.css'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false 

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

            <link rel="shortcut icon" href="/favicon.ico" />
            <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
            <link rel="icon" type="image/png" href="/favicon.png" sizes="96x96" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

            <link href="https://fonts.googleapis.com/css2?family=Muli:wght@400;700&family=Roboto:wght@300;500&display=swap" rel="stylesheet"></link>

            <title>{ title } | Fachschaft IWI</title>
          </Head>

          <Menu />

          <Header {...pageProps.data.header} />
          
          <section className="main w-full max-w-screen-lg mx-auto">
            <Component {...pageProps} />
          </section>
          
          <Footer />
        </>
    )
}

export default IWIWebsite