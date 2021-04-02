import PageHead from './../components/common/page-head'
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
          <PageHead title={title} og={og} />

          <Menu />

          <Header {...pageProps.data.header} />
          
          <section className="main w-full max-w-screen-lg mx-auto px-8">
            <Component {...pageProps} />
          </section>
          
          <Footer />

          <script src="/scripts/menu.js"></script>
        </>
    )
}

export default IWIWebsite